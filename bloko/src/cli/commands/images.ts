import { getConfig, getS3Config } from '../config.js';
import { createBloko } from '../../driver/index.js';

export async function listOrphanImages() {
  const config = getConfig();
  const s3Config = getS3Config();

  const bloko = createBloko({
    db: config,
    s3: s3Config || undefined,
  });

  try {
    const orphans = await bloko.crud.images.findOrphans();

    if (orphans.length === 0) {
      console.log('No orphan images found.');
      return;
    }

    console.log(`Found ${orphans.length} orphan image(s):\n`);
    for (const img of orphans) {
      console.log(`  ID: ${img.id}`);
      console.log(`  File: ${img.file_name}`);
      console.log(`  S3 Key: ${img.s3_key}`);
      console.log('');
    }
  } finally {
    await bloko.disconnect();
  }
}

export async function cleanupOrphanImages() {
  const config = getConfig();
  const s3Config = getS3Config();

  if (!s3Config) {
    console.error('S3 configuration required for image cleanup');
    process.exit(1);
  }

  const bloko = createBloko({
    db: config,
    s3: s3Config,
  });

  try {
    const orphans = await bloko.crud.images.findOrphans();

    if (orphans.length === 0) {
      console.log('No orphan images to clean up.');
      return;
    }

    console.log(`Deleting ${orphans.length} orphan image(s)...`);

    for (const img of orphans) {
      await bloko.images!.delete(img.id);
      console.log(`  Deleted: ${img.file_name}`);
    }

    console.log('Cleanup complete.');
  } finally {
    await bloko.disconnect();
  }
}

export async function assignImageToNode(imageId: string, nodeId: string) {
  const config = getConfig();

  const bloko = createBloko({
    db: config,
  });

  try {
    const image = await bloko.crud.images.findById(imageId);
    if (!image) {
      console.error(`Image not found: ${imageId}`);
      process.exit(1);
    }

    const node = await bloko.crud.nodes.findById(nodeId);
    if (!node) {
      console.error(`Node not found: ${nodeId}`);
      process.exit(1);
    }

    await bloko.crud.images.update(imageId, { _node: nodeId });
    console.log(`Image ${imageId} assigned to node ${nodeId}`);
  } finally {
    await bloko.disconnect();
  }
}
