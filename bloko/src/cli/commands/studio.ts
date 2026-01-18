import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

export async function studio(port: number = 4173) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  // Path to the built studio server
  const studioPath = join(__dirname, '..', '..', 'studio', 'index.js');

  console.log(`Starting Bloko Studio on http://localhost:${port}`);

  const child = spawn('node', [studioPath], {
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

  child.on('exit', (code) => {
    process.exit(code ?? 0);
  });
}
