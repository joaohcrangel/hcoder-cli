import { Injectable } from '@nestjs/common';
import { RunService } from '../run/run.service';
import { ProgramEnum } from '../../enums/program.enum';
import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';

@Injectable()
export class PackageService {
  constructor(private readonly run: RunService) {}

  async install(path: string) {
    try {
      await this.run.executeCommand(ProgramEnum.NPM, ['install'], {
        cwd: path,
        shell: true,
      });
    } catch (error) {
      throw new Error(`Failed to install packages: ${error.message}`);
    }
  }

  async rename(path: string, name: string) {
    try {
      const packageJson = await this.getPackageJson(path);
      packageJson.name = name;
      await this.savePackageJson(path, packageJson);
    } catch (error) {
      throw new Error(`Failed to rename package: ${error.message}`);
    }
  }

  private getPackageJsonPath(path: string) {
    return resolve(path, 'package.json');
  }

  async getPackageJson(path: string) {
    try {
      const packageJsonPath = this.getPackageJsonPath(path);
      const packageJson = await readFile(packageJsonPath, 'utf-8');
      return JSON.parse(packageJson);
    } catch (error) {
      throw new Error(`Failed to read package.json: ${error.message}`);
    }
  }

  private async savePackageJson(path: string, content: any) {
    try {
      const packageJsonPath = this.getPackageJsonPath(path);
      await writeFile(
        packageJsonPath,
        JSON.stringify(content, null, 2),
        'utf-8',
      );
    } catch (error) {
      throw new Error(`Failed to save package.json: ${error.message}`);
    }
  }
}
