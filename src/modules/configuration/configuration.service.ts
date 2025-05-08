import { Injectable, OnModuleInit } from '@nestjs/common';
import { homedir } from 'os';
import { access, mkdir, readFile, writeFile } from 'fs/promises';

@Injectable()
export class ConfigurationService implements OnModuleInit {
  private readonly DIR_NAME = '.hcoder';
  private readonly FILE_NAME = 'config.json';
  private configDir: string;
  private configFile: string;

  async onModuleInit() {
    this.configDir = `${homedir()}/${this.DIR_NAME}`;
    this.configFile = `${this.configDir}/${this.FILE_NAME}`;

    await this.ensureDirectoryExists();
    await this.ensureFileExists();
  }

  private async ensureFileExists() {
    try {
      await access(this.configFile);
    } catch (error) {
      await writeFile(this.configFile, JSON.stringify({}), 'utf-8');
    }
  }

  private async ensureDirectoryExists() {
    try {
      await access(this.configDir);
    } catch (error) {
      await mkdir(this.configDir, { recursive: true });
    }
  }

  async getConfig() {
    try {
      const data = await readFile(this.configFile, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return {};
    }
  }

  async setConfig(key: string, value: any) {
    const config = await this.getConfig();
    config[key] = value;
    await writeFile(this.configFile, JSON.stringify(config), 'utf-8');
  }

  async get(key: string) {
    const config = await this.getConfig();
    return config[key];
  }
}
