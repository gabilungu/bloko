/**
 * Bloko Studio Server Entry Point
 *
 * This file exports a function to start the studio server.
 * It wraps the SvelteKit node adapter output.
 */

import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Start the Bloko Studio server
 * @param {number} port - Port to run the server on (default: 4173)
 * @returns {Promise<void>}
 */
export async function startStudio(port = 4173) {
  const serverPath = join(__dirname, 'dist', 'index.js');

  // Check if the build exists
  if (!existsSync(serverPath)) {
    console.error('Studio build not found. Please rebuild the package.');
    process.exit(1);
  }

  console.log(`Starting Bloko Studio on http://localhost:${port}`);

  const child = spawn('node', [serverPath], {
    env: {
      ...process.env,
      PORT: port.toString()
    },
    stdio: 'inherit'
  });

  child.on('error', (error) => {
    console.error('Failed to start Studio:', error.message);
    process.exit(1);
  });

  return new Promise((resolve, reject) => {
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Studio exited with code ${code}`));
      }
    });
  });
}

export default startStudio;
