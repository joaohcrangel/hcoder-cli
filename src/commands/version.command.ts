import { Command, CommandRunner } from 'nest-commander';
import { join } from 'path';
import { readFile } from 'fs/promises';
import * as chalk from 'chalk';

@Command({
  name: 'version',
  description: 'Displays the current version from package.json',
})
export class VersionCommand extends CommandRunner {
  async run(): Promise<void> {
    const packageJson = JSON.parse(
      await readFile(join(__dirname, '..', '..', 'package.json'), 'utf8'),
    );
    const version = packageJson.version;
    console.log();
    console.log(`Hcoder CLI Version: `, chalk.yellow(version));
    console.log();
  }
}
