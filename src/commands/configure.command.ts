import {
  Command,
  CommandRunner,
  InquirerService,
  Option,
} from 'nest-commander';
import { QuestionEnum } from '../enums/question.enum';
import { ConfigurationService } from '../modules/configuration/configuration.service';
import * as ora from 'ora';
import { TableService } from '../modules/table/table.service';
import { ConfigEnum } from '../enums/config.enum';

@Command({
  name: 'configure',
  description: 'Configura as opções do CLI',
  aliases: ['config'],
})
export class ConfigureCommand extends CommandRunner {
  constructor(
    private readonly inquirer: InquirerService,
    private readonly configuration: ConfigurationService,
    private readonly table: TableService,
  ) {
    super();
  }

  async run(_: string[], options?: Record<string, any>) {
    let show = options?.show ?? false;
    let token = options?.token;

    if (show && token) {
      ora().warn('A opção --token é ignorada quando usada junto com --show.');
    }

    if (show) {
      await this.showConfig();
    } else {
      await this.saveConfig(token);
    }
  }

  async showConfig() {
    const config = await this.configuration.getConfig();

    this.table.display(config);
  }

  async saveConfig(token: string) {
    if (!token) {
      const resultToken = await this.inquirer.ask<{ token: string }>(
        QuestionEnum.TOKEN,
        {},
      );

      token = resultToken.token;
    }

    const spinner = ora('Salvando configuração...').start();

    try {
      await this.configuration.setConfig(ConfigEnum.TOKEN, token);
      spinner.succeed('Configuração salva com sucesso!');
    } catch (error) {
      spinner.fail('Erro ao salvar configuração!');
      console.error(error);
    }
  }

  @Option({
    flags: '-t, --token <string>',
    description: 'Token da OpenAI',
  })
  parseToken(value: string): string {
    return value.trim();
  }

  @Option({
    flags: '-s, --show',
    description: 'Mostra as opções de configuração',
  })
  parseShow(): boolean {
    return true;
  }
}
