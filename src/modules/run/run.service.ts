import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import { ProgramEnum } from 'src/enums/program.enum';

@Injectable()
export class RunService {
  async executeCommand(
    command: ProgramEnum,
    args: string[],
    options?: Record<string, any>,
  ): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
      const process = spawn(command, args, options);

      let stdout = '';
      let stderr = '';

      process.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      process.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      process.on('close', (code) => {
        if (code !== 0) {
          reject(
            new Error(`Process exited with code ${code}. Stderr: ${stderr}`),
          );
        } else {
          resolve({ stdout, stderr });
        }
      });

      process.on('error', (error) => {
        reject(new Error(`Failed to start process: ${error.message}`));
      });
    });
  }
}
