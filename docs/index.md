---
layout: home
hero:
  name: Bloko
  text: Multi-language CMS
  tagline: A flexible content management system built with PostgreSQL and S3
  actions:
    - theme: brand
      text: Get Started
      link: /cli/
---

## Core Concepts

### Collections

Collections are organizational containers that group related content. Each collection has its own set of templates and nodes. Examples: `encyclopedia`, `articles`, `glossary`.

### Templates & Blocks

Templates define the structure for content within a collection. Each template has blocks - the individual fields where content is entered (text, lists, images, etc.).

### Nodes

Nodes are the actual content items. Each node uses a template and can have child nodes, forming a tree structure. Nodes store multi-language content in their blocks.

### Node Types

Node types categorize nodes across all collections. Examples: `entry`, `section`, `article`, `page`, `term`. They help distinguish different kinds of content.

### Relations

Relations connect nodes to each other with typed relationships. For example, nodes can be linked with "parent of" / "child of" or "related to" relations.

### Languages

Languages define which translations are available. All text fields (titles, content) support multiple languages.

## Studio

Bloko includes an admin interface called Studio for managing content. Launch it with:

```bash
npx bloko studio
```

Studio provides a visual interface for:
- Browsing collections and nodes
- Creating and editing content in all languages
- Managing templates and blocks
- Creating relations between nodes
- Uploading and managing images
