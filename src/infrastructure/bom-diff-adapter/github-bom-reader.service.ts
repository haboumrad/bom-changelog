import { Injectable } from '@nestjs/common';
import { BomReader } from '../../domain/bom-diff/port/bom-reader';
import { RepositoryVersion } from '../../domain/bom-diff/model/bom';
import axios from 'axios';
import { URLSearchParams } from 'url';
import { GithubCommitExtractorConfiguration } from '../repository-commit-parser-adapter/configuration/github-commit-extractor-configuration.service';
import { GithubBomReaderConfigurationService } from './configuration/github-bom-reader-configuration.service';

@Injectable()
export class GithubBomReader implements BomReader {
  private readonly configuration: GithubCommitExtractorConfiguration;
  constructor(
    private readonly configurationService: GithubBomReaderConfigurationService,
  ) {
    this.configuration = this.configurationService.getConfig();
  }

  resolveBomDiffUrl(
    repositoryName: string,
    fromVersion: string,
    toVersion: string,
  ): string {
    return `https://github.com/${repositoryName}/compare/${fromVersion}...${toVersion}`;
  }

  resolveBomUrl(repositoryName: string): string {
    return `https://github.com/${repositoryName}`;
  }

  async readFile(repoVersion: RepositoryVersion): Promise<string> {
    const queryParams = new URLSearchParams({
      ref: repoVersion.version.selector,
    });
    return axios
      .get(
        `https://api.github.com/repos/${
          repoVersion.repository.name
        }/contents/bom.yml?${queryParams.toString()}`,
        {
          headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${this.configuration.githubToken}`,
            'X-GitHub-Api-Version': '2022-11-28',
          },
        },
      )
      .then((response) => {
        if (response.status == 200) {
          return response.data as GithubContentFileResponse;
        }
        throw new Error(`Error while reading file content. ${response}`);
      })
      .then((githubResponse) => {
        return Buffer.from(githubResponse.content, 'base64').toString();
      });
  }
}

type GithubContentFileResponse = {
  content: string;
};
