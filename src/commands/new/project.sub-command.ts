import { CommandRunner, Option, SubCommand } from 'nest-commander';
import * as ora from 'ora';
import { GitService } from '../../modules/git/git.service';
import { PackageService } from '../../modules/package/package.service';

const templates = ['standalone', 'cli'];

@SubCommand({
  name: 'project',
  description: 'Criar novo projeto',
  aliases: ['p'],
  arguments: '<name>',
  argsDescription: {
    name: 'Nome do projeto',
  },
})
export class ProjectNewSubCommand extends CommandRunner {
  constructor(
    private readonly git: GitService,
    private readonly packageService: PackageService,
  ) {
    super();
  }

  async run(params: string[], options: Record<string, any>) {
    const overwrite = options.overwrite || false;
    const name = params[0];

    if (!templates.includes(options.template)) {
      ora().fail(
        `Template "${options.template}" não é válido. Escolha entre ${templates.join(', ')}`,
      );
      return;
    }

    const spinner = ora('Clonando repositório...').start();

    try {
      await this.git.clone(options.template, name, overwrite);

      spinner.succeed('Repositório clonado com sucesso!');

      spinner.start('Removendo pasta .git...');

      await this.git.removeGitFolder(name);

      spinner.succeed('Pasta .git removida com sucesso!');

      spinner.start('Iniciando repositório git...');

      await this.git.init(name);

      spinner.succeed('Repositório git iniciado com sucesso!');

      spinner.start('Renomeando projeto...');

      await this.packageService.rename(name, name);

      spinner.succeed('Projeto renomeado com sucesso!');

      spinner.start('Instalando dependências... 🍵');

      await this.packageService.install(name);

      spinner.succeed('Dependências instaladas com sucesso!');
    } catch (error: any) {
      spinner.fail(`Erro ao criar projeto! ${error?.message}`);
    }
  }

  @Option({
    flags: '-t, --template <template>',
    description: 'Template do projeto',
    choices: templates,
    defaultValue: 'standalone',
  })
  parseTemplate(template: string): string {
    return template;
  }

  @Option({
    flags: '-o, --overwrite',
    description: 'Sobrescrever projeto existente',
    defaultValue: false,
  })
  parseOverwrite(): boolean {
    return true;
  }
}
