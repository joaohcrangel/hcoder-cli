import { Injectable } from '@nestjs/common';
import { RunService } from '../run/run.service';
import { existsSync } from 'fs';
import { rm } from 'fs/promises';
import { ProgramEnum } from '../../enums/program.enum';
import { RequirementsService } from '../requirements/requirements.service';

@Injectable()
export class GitService {
  private readonly user = 'hcoder-templates';

  constructor(
    private readonly run: RunService,
    private readonly requirements: RequirementsService,
  ) {}

  async clone(repoName: string, name: string, overwrite = false) {
    if (existsSync(name)) {
      if (overwrite) {
        await rm(name, { recursive: true, force: true });
      } else {
        throw new Error(`Directory ${name} already exists`);
      }
    }

    const url = `https://github.com/${this.user}/${repoName}.git`;

    try {
      await this.requirements.isGitAvailable();
      await this.run.executeCommand(ProgramEnum.GIT, ['clone', url, name]);
    } catch (error) {
      throw new Error(`Failed to clone repository: ${error.message}`);
    }
  }

  async init(path: string) {
    try {
      await this.requirements.isGitAvailable();
      await this.run.executeCommand(ProgramEnum.GIT, ['init'], {
        cwd: path,
      });
    } catch (error) {
      throw new Error(`Failed to initialize git repository: ${error.message}`);
    }
  }

  async removeGitFolder(path: string) {
    try {
      await rm(`${path}/.git`, { recursive: true, force: true });
    } catch (error) {
      throw new Error(`Failed to remove .git folder: ${error.message}`);
    }
  }
}
