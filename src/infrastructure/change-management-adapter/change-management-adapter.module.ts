import { Module } from '@nestjs/common';
import { JiraChangeExtractor } from './jira-change-extractor.service';
import { CHANGE_EXTRACTOR } from '../../domain/change-management/port/change-extractor';
import { ConfigModule } from '@nestjs/config';
import { JiraChangeExtractorConfigurationService } from './configuration/jira-change-extractor-configuration.service';
import { validateJiraChangeExtractorEnvVars } from './configuration/jira-change-extractor-env-vars.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        `${process.env.HOME}/.changelog/${process.env.BOM_CONTEXT}/.env.jira-change-management-adapter`,
        `envs/test/.env.jira-change-management-adapter`,
      ],
      isGlobal: false,
      validate: validateJiraChangeExtractorEnvVars,
    }),
  ],
  providers: [
    JiraChangeExtractorConfigurationService,
    { provide: CHANGE_EXTRACTOR, useClass: JiraChangeExtractor },
  ],
  exports: [CHANGE_EXTRACTOR],
})
export class ChangeManagementAdapterModule {}
