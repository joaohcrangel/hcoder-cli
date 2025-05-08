import { spawn } from 'child_process';

export function runCLI(args: string[]) {
  return new Promise<{ output: string; code: number }>((resolve) => {
    const child = spawn('node', ['dist/main.js', ...args]);

    let output = '';

    child.stdout.on('data', (data) => (output += data.toString()));

    child.stderr.on('data', (data) => (output += data.toString()));

    child.on('close', (code) => resolve({ code: Number(code), output }));
  });
}
