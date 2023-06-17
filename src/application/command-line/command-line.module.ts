import { Module } from '@nestjs/common';
import { AppEntrypointModule } from '../../domain/app-entrypoint/app-entrypoint.module';
import { CommandLineService } from './command-line.service';
import { CommandLineConfigurationService } from './configuration/command-line-configuration.service';
import { ConfigModule } from '@nestjs/config';
import { validateCommandLineEnvVars } from './configuration/command-line-env-vars.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        `${process.env.HOME}/.changelog/${process.env.BOM_CONTEXT}/.env.command-line`,
        `envs/test/.env.command-line`,
      ],
      isGlobal: false,
      validate: validateCommandLineEnvVars,
    }),
    AppEntrypointModule,
  ],
  providers: [CommandLineConfigurationService, CommandLineService],

  exports: [CommandLineService],
})
export class CommandLineModule {}
