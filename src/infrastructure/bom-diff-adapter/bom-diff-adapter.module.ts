import { Module } from '@nestjs/common';
import { GithubBomReader } from './github-bom-reader.service';
import { BOM_READER } from '../../domain/bom-diff/port/bom-reader';
import { ConfigModule } from '@nestjs/config';
import { validateGithubBomReaderEnvVars } from './configuration/github-bom-reader-env-vars.validation';
import { GithubBomReaderConfigurationService } from './configuration/github-bom-reader-configuration.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        `${process.env.HOME}/.changelog/${process.env.BOM_CONTEXT}/.env.github-bom-diff-adapter`,
        `envs/test/.env.github-bom-diff-adapter`,
      ],
      isGlobal: false,
      validate: validateGithubBomReaderEnvVars,
    }),
  ],
  providers: [
    GithubBomReaderConfigurationService,
    { provide: BOM_READER, useClass: GithubBomReader },
  ],
  exports: [BOM_READER],
})
export class BomDiffAdapterModule {}
