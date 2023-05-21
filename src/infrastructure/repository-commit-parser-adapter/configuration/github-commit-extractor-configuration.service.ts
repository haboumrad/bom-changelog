import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubCommitExtractorConfigurationService {
  constructor(
    private appConfigService: ConfigService<Record<string, unknown>, true>,
  ) {}

  getConfig(): GithubCommitExtractorConfiguration {
    return {
      githubToken: this.appConfigService.get<string>('GITHUB_TOKEN'),
    };
  }
}

export type GithubCommitExtractorConfiguration = {
  githubToken: string;
};
