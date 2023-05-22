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
        `envs/${process.env.NODE_ENV}/.env.command-line`,
        '.env.command-line',
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
