import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubBomReaderConfigurationService {
  constructor(
    private appConfigService: ConfigService<Record<string, unknown>, true>,
  ) {}

  getConfig(): GithubBomReaderConfiguration {
    return {
      githubToken: this.appConfigService.get<string>('GITHUB_TOKEN'),
    };
  }
}

export type GithubBomReaderConfiguration = {
  githubToken: string;
};
