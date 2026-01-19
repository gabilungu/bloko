# images

Manage image ownership and cleanup orphan images.

## Usage

```bash
bloko images <command>
```

## Commands

### orphans

List all images that don't have an owner node.

```bash
bloko images orphans
```

Output:
```
Found 3 orphan image(s):

  ID: 0192d1a2-3b4c-7d5e-8f9a-0b1c2d3e4f5a
  File: photo.jpg
  S3 Key: images/0192d1a2-3b4c-7d5e-8f9a-0b1c2d3e4f5a.jpeg

  ID: 0192d1a2-3b4c-7d5e-8f9a-0b1c2d3e4f5b
  File: banner.png
  S3 Key: images/0192d1a2-3b4c-7d5e-8f9a-0b1c2d3e4f5b.png
```

### cleanup

Delete all orphan images from both the database and S3 storage.

```bash
bloko images cleanup
```

Output:
```
Deleting 3 orphan image(s)...
  Deleted: photo.jpg
  Deleted: banner.png
  Deleted: icon.webp
Cleanup complete.
```

### assign

Assign an orphan image to a specific node.

```bash
bloko images assign <imageId> <nodeId>
```

Example:
```bash
bloko images assign 0192d1a2-3b4c-7d5e-8f9a-0b1c2d3e4f5a 0192d1a2-1111-2222-3333-444455556666
```

Output:
```
Image 0192d1a2-3b4c-7d5e-8f9a-0b1c2d3e4f5a assigned to node 0192d1a2-1111-2222-3333-444455556666
```

## Background

Images in Bloko use a single-owner model where each image belongs to exactly one node. When a node is deleted, all its images are automatically deleted via CASCADE.

Orphan images (images without an owner node) can occur during:
- Migration from an older version
- Manual database operations
- Failed uploads

Use these commands to identify and clean up orphan images.
