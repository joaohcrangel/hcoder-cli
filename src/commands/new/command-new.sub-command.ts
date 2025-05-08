import { CommandRunner, SubCommand } from 'nest-commander';
import { PackageService } from '../../modules/package/package.service';
import * as ora from 'ora';
import { OpenaiService } from '../../modules/openia/openai.service';
import { readFile, writeFile } from 'fs/promises';
import { ResponseCommandFileType } from '../../types/response-command-file.type';

@SubCommand({
  name: 'commnd',
  description: 'Gerar novos comandos',
  aliases: ['cmd', 'c'],
  arguments: '<name> <prompt>',
  argsDescription: {
    name: 'Nome do comando',
    description: 'Prompt do comando',
  },
})
export class CommandNewSubCommand extends CommandRunner {
  constructor(
    private readonly packageService: PackageService,
    private readonly openai: OpenaiService,
  ) {
    super();
  }

  async run(
    passedParam: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    const name = passedParam[0];
    const prompt = passedParam[1];

    const spinner = ora('Criando comando...').start();

    try {
      await this.validate();
      spinner.succeed(`Projeto válido`);

      spinner.start(`Gerando comando ${name}...`);

      const responseCommand = await this.openai.sendThread([
        {
          content: `Nome do comando: ${name}\nPrompt: ${prompt}`,
          role: 'user',
        },
      ]);

      spinner.succeed(`Comando ${name} gerado com sucesso!`);

      spinner.start(`Criando arquivo ${name}.ts...`);

      const resultCommand =
        this.parseResponse<ResponseCommandFileType>(responseCommand);

      await writeFile(
        `src/commands/${resultCommand.fileName}.ts`,
        resultCommand.fileContent,
        'utf-8',
      );

      spinner.succeed(`Arquivo ${name}.ts criado com sucesso!`);

      spinner.start(`Adicionando o comando no app.module.ts...`);

      const appModuleContent = await readFile('src/app.module.ts', 'utf-8');

      const responseModule = await this.openai.sendThread([
        {
          content: `Adicione o import do comando ${resultCommand.className} no arquivo app.module.ts e adicioone no array de providers. \n O arquivo app.module.ts é o seguinte:\n\n${appModuleContent}`,
          role: 'user',
        },
      ]);

      spinner.succeed(
        `Comando ${name} adicionado no app.module.ts com sucesso!`,
      );

      spinner.start(`Atualizando o arquivo app.module.ts...`);

      const resultModule =
        this.parseResponse<ResponseCommandFileType>(responseModule);

      await writeFile('src/app.module.ts', resultModule.fileContent, 'utf-8');

      spinner.succeed(`Arquivo app.module.ts atualizado com sucesso!`);

      spinner.start().succeed(`Comando ${name} gerado com sucesso!`);
    } catch (error: any) {
      spinner.fail(`Erro ao gerar comando: ${error?.message}`);
    }
  }

  parseResponse<T>(response: string | undefined) {
    if (!response) {
      throw new Error('Resposta vazia');
    }

    const result = response.replaceAll('```json', '').replaceAll('```', '');

    return JSON.parse(result) as T;
  }

  async validate() {
    const data = await this.packageService.getPackageJson('.');

    if (!data.bin) {
      throw new Error('bin não encontrado no package.json');
    }

    if (!data.dependencies['nest-commander']) {
      throw new Error('Nest Commander não foi encontrado.');
    }
  }
}
