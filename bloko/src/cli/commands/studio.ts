import { spawn } from 'child_process';

export async function studio(port: number = 4173) {
  console.log('Starting Bloko Studio...');

  // Use npx to run bloko-studio (downloads on-demand if not installed)
  const child = spawn('npx', ['bloko-studio', port.toString()], {
    stdio: 'inherit',
    env: process.env
  });

  child.on('error', (error) => {
    console.error('Failed to start Studio:', error.message);
    process.exit(1);
  });

  child.on('exit', (code) => {
    process.exit(code ?? 0);
  });
}
