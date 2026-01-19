#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// Load .env from current working directory (no dotenv dependency)
function loadEnv() {
  const envPath = resolve(process.cwd(), '.env');
  if (!existsSync(envPath)) return;

  const content = readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    if (key && rest.length > 0) {
      process.env[key.trim()] = rest.join('=').trim();
    }
  }
}

loadEnv();

import { init } from './commands/init.js';
import { reinit } from './commands/reinit.js';
import { seed } from './commands/seed.js';
import { studio } from './commands/studio.js';
import { listOrphanImages, cleanupOrphanImages, assignImageToNode } from './commands/images.js';

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  try {
    switch (command) {
      case 'init':
        await init();
        break;
      case 'reinit':
        await reinit();
        break;
      case 'seed':
        const preset = args[1];
        if (!preset) {
          console.error('Usage: bloko seed <preset>');
          console.error('Available presets: dermatology, glossaries');
          process.exit(1);
        }
        await seed(preset);
        break;
      case 'studio':
        const port = args[1] ? parseInt(args[1], 10) : 4173;
        await studio(port);
        break;
      case 'images':
        const subCmd = args[1];
        switch (subCmd) {
          case 'orphans':
            await listOrphanImages();
            break;
          case 'cleanup':
            await cleanupOrphanImages();
            break;
          case 'assign':
            const imgId = args[2];
            const nodeId = args[3];
            if (!imgId || !nodeId) {
              console.error('Usage: bloko images assign <imageId> <nodeId>');
              process.exit(1);
            }
            await assignImageToNode(imgId, nodeId);
            break;
          default:
            console.error('Usage: bloko images <orphans|cleanup|assign>');
            console.error('  orphans              List images without an owner node');
            console.error('  cleanup              Delete all orphan images');
            console.error('  assign <img> <node>  Assign an image to a node');
            process.exit(1);
        }
        break;
      case 'help':
      case '--help':
      case '-h':
        printHelp();
        break;
      default:
        console.error(`Unknown command: ${command}`);
        printHelp();
        process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

function printHelp() {
  console.log(`
Bloko CLI

Usage: bloko <command> [options]

Commands:
  init              Initialize the database schema
  reinit            Drop and recreate the database schema
  seed <preset>     Seed the database with preset data
  studio [port]     Start Bloko Studio (default port: 4173)
  images <cmd>      Image management commands

Image commands:
  images orphans              List images without an owner node
  images cleanup              Delete all orphan images from DB and S3
  images assign <img> <node>  Assign an image to a node

Available presets:
  dermatology       Medical dermatology glossary
  glossaries        Multi-language glossary template

Environment variables:
  BLOKO_PG_HOST        PostgreSQL host (default: localhost)
  BLOKO_PG_PORT        PostgreSQL port (default: 5432)
  BLOKO_PG_DATABASE    PostgreSQL database (default: bloko)
  BLOKO_PG_USER        PostgreSQL user (default: postgres)
  BLOKO_PG_PASSWORD    PostgreSQL password (required)
`);
}

main();
