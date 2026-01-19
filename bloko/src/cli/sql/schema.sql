-- Bloko CMS Schema
-- PostgreSQL 14+ with pgcrypto extension

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- UUIDv7 function
CREATE OR REPLACE FUNCTION uuidv7() RETURNS uuid AS $$
DECLARE
  unix_ts_ms BIGINT;
  uuid_bytes BYTEA;
BEGIN
  unix_ts_ms := (EXTRACT(EPOCH FROM clock_timestamp()) * 1000)::BIGINT;
  uuid_bytes := decode(lpad(to_hex(unix_ts_ms), 12, '0'), 'hex') || gen_random_bytes(10);
  uuid_bytes := set_byte(uuid_bytes, 6, (get_byte(uuid_bytes, 6) & 15) | 112);
  uuid_bytes := set_byte(uuid_bytes, 8, (get_byte(uuid_bytes, 8) & 63) | 128);
  RETURN encode(uuid_bytes, 'hex')::uuid;
END;
$$ LANGUAGE plpgsql;

-- Enums
CREATE TYPE content_type AS ENUM (
  'number',
  'text',
  'text_list',
  'titled_text_list',
  'image',
  'image_list'
);

CREATE TYPE sort_children_by AS ENUM ('sort', 'title', 'subtitle');

-- Tables
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  code VARCHAR(50) NOT NULL UNIQUE,
  sort INTEGER,
  notes TEXT
);

CREATE TABLE languages (
  id VARCHAR(8) PRIMARY KEY,
  title VARCHAR(50) NOT NULL,
  sort INTEGER
);

ALTER TABLE languages ADD CONSTRAINT languages_id_format
  CHECK (id ~ '^[a-z]{2,3}(-[a-z]{2,4})?$');

CREATE TABLE node_types (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  code VARCHAR(50) NOT NULL UNIQUE,
  title JSONB,
  sort INTEGER,
  notes TEXT
);

CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  code VARCHAR(50) NOT NULL,
  _collection UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  title JSONB,
  sort INTEGER,
  notes TEXT,
  UNIQUE (_collection, code)
);

CREATE TABLE blocks (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  code VARCHAR(50) NOT NULL,
  _template UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  _parent UUID REFERENCES blocks(id) ON DELETE CASCADE,
  title JSONB,
  content_type content_type,
  sort INTEGER,
  notes TEXT,
  UNIQUE (_template, code)
);

CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  _node UUID,  -- Owner node (FK added after nodes table)
  s3_key VARCHAR(500) NOT NULL UNIQUE,
  file_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(50) NOT NULL,
  format VARCHAR(10) NOT NULL,
  file_size INTEGER NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  caption JSONB,
  credit JSONB
);

CREATE TABLE image_variants (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  _image UUID NOT NULL REFERENCES images(id) ON DELETE CASCADE,

  -- Request params (nullable means "auto" / use original)
  req_width INTEGER,
  req_height INTEGER,
  format VARCHAR(10) NOT NULL DEFAULT 'webp',
  quality INTEGER NOT NULL DEFAULT 80,

  -- Actual output dimensions after resize/crop
  actual_width INTEGER NOT NULL,
  actual_height INTEGER NOT NULL,

  s3_key VARCHAR(500) NOT NULL UNIQUE,
  file_size INTEGER NOT NULL
);

CREATE TABLE nodes (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  code VARCHAR(50) NOT NULL,
  _collection UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  _template UUID REFERENCES templates(id) ON DELETE SET NULL,
  _node_type UUID NOT NULL REFERENCES node_types(id) ON DELETE CASCADE,
  _parent UUID REFERENCES nodes(id) ON DELETE CASCADE,
  title JSONB,
  subtitle JSONB,
  slug JSONB,
  sort INTEGER,
  sort_children_by sort_children_by,
  _cover_image UUID REFERENCES images(id) ON DELETE SET NULL,
  _images JSONB,
  notes TEXT,
  UNIQUE (_collection, code)
);

-- Add FK constraint for images._node (after nodes table exists)
ALTER TABLE images
  ADD CONSTRAINT images_node_fk FOREIGN KEY (_node) REFERENCES nodes(id) ON DELETE CASCADE;

CREATE TABLE contents (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  _node UUID NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  _block UUID NOT NULL REFERENCES blocks(id) ON DELETE CASCADE,
  value JSONB NOT NULL,
  UNIQUE (_node, _block)
);

CREATE TABLE node_relation_types (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  code VARCHAR(50) NOT NULL,
  _collection UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  title JSONB,
  reverse_title JSONB,
  notes TEXT,
  UNIQUE (_collection, code)
);

CREATE TABLE node_relations (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  _from UUID NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  _to UUID NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  _node_relation_type UUID NOT NULL REFERENCES node_relation_types(id) ON DELETE CASCADE,
  UNIQUE (_from, _to, _node_relation_type)
);

-- Indexes
CREATE INDEX idx_node_types_title_gin ON node_types USING GIN (title);

CREATE INDEX idx_templates_collection ON templates(_collection);
CREATE INDEX idx_templates_title_gin ON templates USING GIN (title);

CREATE INDEX idx_blocks_template ON blocks(_template);
CREATE INDEX idx_blocks_parent ON blocks(_parent);
CREATE INDEX idx_blocks_title_gin ON blocks USING GIN (title);

CREATE INDEX idx_images_node ON images(_node);
CREATE INDEX idx_images_caption_gin ON images USING GIN (caption);

CREATE INDEX idx_image_variants_image ON image_variants(_image);

-- Unique constraint for variant lookup (COALESCE handles nullable req_width/req_height)
CREATE UNIQUE INDEX idx_image_variants_params ON image_variants (
  _image,
  COALESCE(req_width, 0),
  COALESCE(req_height, 0),
  format,
  quality
);

CREATE INDEX idx_nodes_collection ON nodes(_collection);
CREATE INDEX idx_nodes_template ON nodes(_template);
CREATE INDEX idx_nodes_node_type ON nodes(_node_type);
CREATE INDEX idx_nodes_parent ON nodes(_parent);
CREATE INDEX idx_nodes_cover_image ON nodes(_cover_image);
CREATE INDEX idx_nodes_title_gin ON nodes USING GIN (title);
CREATE INDEX idx_nodes_slug_gin ON nodes USING GIN (slug);

CREATE UNIQUE INDEX idx_nodes_slug_unique_top_level
  ON nodes ((slug->>'en'))
  WHERE _parent IS NULL;

CREATE INDEX idx_contents_node ON contents(_node);
CREATE INDEX idx_contents_block ON contents(_block);

CREATE INDEX idx_node_relation_types_collection ON node_relation_types(_collection);
CREATE INDEX idx_node_relation_types_title_gin ON node_relation_types USING GIN (title);

CREATE INDEX idx_node_relations_from ON node_relations(_from);
CREATE INDEX idx_node_relations_to ON node_relations(_to);
CREATE INDEX idx_node_relations_type ON node_relations(_node_relation_type);

-- Triggers

-- Language delete cascade
CREATE OR REPLACE FUNCTION cascade_language_delete()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE nodes SET
    title = title - OLD.id,
    subtitle = subtitle - OLD.id,
    slug = slug - OLD.id
  WHERE title ? OLD.id OR subtitle ? OLD.id OR slug ? OLD.id;

  UPDATE node_types SET title = title - OLD.id WHERE title ? OLD.id;
  UPDATE templates SET title = title - OLD.id WHERE title ? OLD.id;
  UPDATE blocks SET title = title - OLD.id WHERE title ? OLD.id;

  UPDATE node_relation_types SET
    title = title - OLD.id,
    reverse_title = reverse_title - OLD.id
  WHERE title ? OLD.id OR reverse_title ? OLD.id;

  UPDATE images SET
    caption = caption - OLD.id,
    credit = credit - OLD.id
  WHERE caption ? OLD.id OR credit ? OLD.id;

  UPDATE contents SET value = value - OLD.id
  WHERE value ? OLD.id AND jsonb_typeof(value) = 'object';

  UPDATE contents SET value = (
    SELECT jsonb_agg(
      CASE
        WHEN jsonb_typeof(elem) = 'object' THEN elem - OLD.id
        ELSE elem
      END
    )
    FROM jsonb_array_elements(value) elem
  )
  WHERE jsonb_typeof(value) = 'array';

  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_language_delete
  BEFORE DELETE ON languages
  FOR EACH ROW
  EXECUTE FUNCTION cascade_language_delete();

-- Language rename cascade
CREATE OR REPLACE FUNCTION cascade_language_rename()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.id != NEW.id THEN
    UPDATE nodes SET
      title = (title - OLD.id) || jsonb_build_object(NEW.id, title->OLD.id),
      subtitle = (subtitle - OLD.id) || jsonb_build_object(NEW.id, subtitle->OLD.id),
      slug = (slug - OLD.id) || jsonb_build_object(NEW.id, slug->OLD.id)
    WHERE title ? OLD.id OR subtitle ? OLD.id OR slug ? OLD.id;

    UPDATE node_types SET
      title = (title - OLD.id) || jsonb_build_object(NEW.id, title->OLD.id)
    WHERE title ? OLD.id;

    UPDATE templates SET
      title = (title - OLD.id) || jsonb_build_object(NEW.id, title->OLD.id)
    WHERE title ? OLD.id;

    UPDATE blocks SET
      title = (title - OLD.id) || jsonb_build_object(NEW.id, title->OLD.id)
    WHERE title ? OLD.id;

    UPDATE node_relation_types SET
      title = (title - OLD.id) || jsonb_build_object(NEW.id, title->OLD.id),
      reverse_title = (reverse_title - OLD.id) || jsonb_build_object(NEW.id, reverse_title->OLD.id)
    WHERE title ? OLD.id OR reverse_title ? OLD.id;

    UPDATE images SET
      caption = (caption - OLD.id) || jsonb_build_object(NEW.id, caption->OLD.id),
      credit = (credit - OLD.id) || jsonb_build_object(NEW.id, credit->OLD.id)
    WHERE caption ? OLD.id OR credit ? OLD.id;

    UPDATE contents SET
      value = (value - OLD.id) || jsonb_build_object(NEW.id, value->OLD.id)
    WHERE value ? OLD.id AND jsonb_typeof(value) = 'object';

    UPDATE contents SET value = (
      SELECT jsonb_agg(
        CASE
          WHEN jsonb_typeof(elem) = 'object' AND elem ? OLD.id THEN
            (elem - OLD.id) || jsonb_build_object(NEW.id, elem->OLD.id)
          ELSE elem
        END
      )
      FROM jsonb_array_elements(value) elem
    )
    WHERE jsonb_typeof(value) = 'array';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_language_rename
  BEFORE UPDATE ON languages
  FOR EACH ROW
  EXECUTE FUNCTION cascade_language_rename();

-- Block content_type change cascade
CREATE OR REPLACE FUNCTION cascade_block_content_type_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.content_type IS DISTINCT FROM NEW.content_type THEN
    DELETE FROM contents WHERE _block = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_block_content_type
  BEFORE UPDATE OF content_type ON blocks
  FOR EACH ROW
  EXECUTE FUNCTION cascade_block_content_type_change();

-- Image delete from nodes gallery
CREATE OR REPLACE FUNCTION cascade_image_delete_from_nodes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE nodes SET _images = (
    SELECT COALESCE(jsonb_agg(elem), '[]'::jsonb)
    FROM jsonb_array_elements(_images) elem
    WHERE (elem->>'_image')::uuid != OLD.id
  )
  WHERE _images @> jsonb_build_array(jsonb_build_object('_image', OLD.id::text));

  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_image_delete_from_nodes
  BEFORE DELETE ON images
  FOR EACH ROW
  EXECUTE FUNCTION cascade_image_delete_from_nodes();

-- Node parent validation
CREATE OR REPLACE FUNCTION validate_node_parent()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW._parent IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM nodes
      WHERE id = NEW._parent AND _collection = NEW._collection
    ) THEN
      RAISE EXCEPTION 'Parent node must be in the same collection';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_node_parent_validate
  BEFORE INSERT OR UPDATE OF _parent, _collection ON nodes
  FOR EACH ROW
  EXECUTE FUNCTION validate_node_parent();

-- Node slug generation
CREATE OR REPLACE FUNCTION generate_slug()
RETURNS TRIGGER AS $$
DECLARE
  lang TEXT;
  title_value TEXT;
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  FOR lang IN SELECT jsonb_object_keys(NEW.title)
  LOOP
    title_value := NEW.title->>lang;
    IF title_value IS NOT NULL AND title_value != '' THEN
      -- Remove accents first (ă→a, é→e, etc.), then slugify
      base_slug := lower(regexp_replace(unaccent(title_value), '[^a-zA-Z0-9]+', '-', 'g'));
      base_slug := trim(both '-' from base_slug);

      final_slug := base_slug;
      counter := 0;

      WHILE EXISTS (
        SELECT 1 FROM nodes
        WHERE id != NEW.id
          AND COALESCE(_parent, '00000000-0000-0000-0000-000000000000') =
              COALESCE(NEW._parent, '00000000-0000-0000-0000-000000000000')
          AND slug->>lang = final_slug
      ) LOOP
        counter := counter + 1;
        final_slug := base_slug || '-' || counter;
      END LOOP;

      NEW.slug := COALESCE(NEW.slug, '{}'::jsonb) || jsonb_build_object(lang, final_slug);
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_node_slug
  BEFORE INSERT OR UPDATE OF title, _parent ON nodes
  FOR EACH ROW
  EXECUTE FUNCTION generate_slug();

-- Content validation
CREATE OR REPLACE FUNCTION validate_content_block()
RETURNS TRIGGER AS $$
DECLARE
  node_template UUID;
  block_template UUID;
  block_content_type content_type;
BEGIN
  SELECT _template INTO node_template FROM nodes WHERE id = NEW._node;
  SELECT _template, content_type INTO block_template, block_content_type
    FROM blocks WHERE id = NEW._block;

  IF block_content_type IS NULL THEN
    RAISE EXCEPTION 'Block must have a content_type to store content';
  END IF;

  IF node_template IS DISTINCT FROM block_template THEN
    RAISE EXCEPTION 'Block template must match node template';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_content_validate
  BEFORE INSERT OR UPDATE ON contents
  FOR EACH ROW
  EXECUTE FUNCTION validate_content_block();

-- Node relation validation
CREATE OR REPLACE FUNCTION validate_node_relation()
RETURNS TRIGGER AS $$
DECLARE
  from_collection UUID;
  type_collection UUID;
BEGIN
  SELECT _collection INTO from_collection FROM nodes WHERE id = NEW._from;
  SELECT _collection INTO type_collection FROM node_relation_types WHERE id = NEW._node_relation_type;

  IF from_collection != type_collection THEN
    RAISE EXCEPTION 'From node must be in the same collection as the relation type';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_node_relation_validate
  BEFORE INSERT OR UPDATE ON node_relations
  FOR EACH ROW
  EXECUTE FUNCTION validate_node_relation();
