import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JiraChangeExtractorConfigurationService {
  constructor(
    private appConfigService: ConfigService<Record<string, unknown>, true>,
  ) {}

  getConfig(): JiraChangeExtractorConfiguration {
    return {
      jiraUrl: this.appConfigService.get<string>('JIRA_URL'),
      jiraUser: this.appConfigService.get<string>('JIRA_USER'),
      jiraToken: this.appConfigService.get<string>('JIRA_TOKEN'),
    };
  }
}

export type JiraChangeExtractorConfiguration = {
  jiraUser: string;
  jiraToken: string;
  jiraUrl: string;
};
