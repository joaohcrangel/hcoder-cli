import { Command, CommandRunner } from 'nest-commander';
import * as ora from 'ora';
import { ProjectNewSubCommand } from './new/project.sub-command';
import { CommandNewSubCommand } from './new/command-new.sub-command';

@Command({
  name: 'new',
  description: 'Criar novos recursos',
  aliases: ['n'],
  subCommands: [ProjectNewSubCommand, CommandNewSubCommand],
})
export class NewCommand extends CommandRunner {
  async run(): Promise<void> {
    ora().info('Escolha um subcomando para criar novos recursos.');
  }
}
