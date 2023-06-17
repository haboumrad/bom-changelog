import { Module } from '@nestjs/common';
import { COMMIT_EXTRACTOR } from '../../domain/repository-commit-parser/port/commit-extractor';
import { GithubCommitExtractor } from './github-commit-extractor.service';
import { ConfigModule } from '@nestjs/config';
import { GithubCommitExtractorConfigurationService } from './configuration/github-commit-extractor-configuration.service';
import { validateGithubCommitExtractorEnvVars } from './configuration/github-commit-extractor-env-vars.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        `${process.env.HOME}/.changelog/${process.env.BOM_CONTEXT}/.env.github-repository-commit-parser-adapter`,
        `envs/test/.env.github-repository-commit-parser-adapter`,
      ],
      isGlobal: false,
      validate: validateGithubCommitExtractorEnvVars,
    }),
  ],
  providers: [
    GithubCommitExtractorConfigurationService,
    { provide: COMMIT_EXTRACTOR, useClass: GithubCommitExtractor },
  ],
  exports: [COMMIT_EXTRACTOR],
})
export class RepositoryCommitParserAdapterModule {}
