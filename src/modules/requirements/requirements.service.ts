import { Injectable } from '@nestjs/common';
import { RunService } from '../run/run.service';
import { ProgramEnum } from '../../enums/program.enum';

@Injectable()
export class RequirementsService {
  constructor(private readonly run: RunService) {}

  async isGitAvailable(): Promise<boolean> {
    try {
      const result = await this.run.executeCommand(ProgramEnum.GIT, [
        '--version',
      ]);
      return result.stdout.includes('git version');
    } catch (error) {
      return false;
    }
  }

  async isNpmAvailable(): Promise<boolean> {
    try {
      const result = await this.run.executeCommand(
        ProgramEnum.NPM,
        ['--version'],
        {
          shell: true,
        },
      );
      return !!result.stdout.trim();
    } catch (error) {
      return false;
    }
  }
}
