import { Module } from '@nestjs/common';
import { ConfigureCommand } from './commands/configure.command';
import { TokenQuestion } from './questions/token.question';
import { ConfigurationModule } from './modules/configuration/configuration.module';
import { TableModule } from './modules/table/table.module';
import { NewCommand } from './commands/new.command';
import { ProjectNewSubCommand } from './commands/new/project.sub-command';
import { RunModule } from './modules/run/run.module';
import { RequirementsModule } from './modules/requirements/requirements.module';
import { GitModule } from './modules/git/git.module';
import { PackageModule } from './modules/package/package.module';
import { CommandNewSubCommand } from './commands/new/command-new.sub-command';
import { OpenaiModule } from './modules/openia/openai.module';
import { VersionCommand } from './commands/version.command';

@Module({
  imports: [
    ConfigurationModule,
    TableModule,
    RunModule,
    RequirementsModule,
    GitModule,
    PackageModule,
    OpenaiModule,
  ],
  controllers: [],
  providers: [
    ConfigureCommand,
    TokenQuestion,
    NewCommand,
    ProjectNewSubCommand,
    CommandNewSubCommand,
    VersionCommand,
  ],
})
export class AppModule {}
