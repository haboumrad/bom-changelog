import { Injectable } from '@nestjs/common';
import { Repository, Version } from '../../domain/bom-diff/model/bom';
import { CommitExtractor } from '../../domain/repository-commit-parser/port/commit-extractor';
import { Commit } from '../../domain/repository-commit-parser/model/Commit';
import axios from 'axios';
import {
  GithubCommitExtractorConfiguration,
  GithubCommitExtractorConfigurationService,
} from './configuration/github-commit-extractor-configuration.service';

@Injectable()
export class GithubCommitExtractor implements CommitExtractor {
  private readonly configuration: GithubCommitExtractorConfiguration;
  constructor(
    private readonly configurationService: GithubCommitExtractorConfigurationService,
  ) {
    this.configuration = this.configurationService.getConfig();
  }

  resolveRepositoryDiffUrl(
    repositoryName: string,
    fromVersion: string,
    toVersion: string,
  ): string {
    return `https://github.com/${repositoryName}/compare/${fromVersion}...${toVersion}`;
  }
  resolveRepositoryUrl(repositoryName: string): string {
    return `https://github.com/${repositoryName}`;
  }

  async getCommits(
    repository: Repository,
    from: Version,
    to: Version,
  ): Promise<Commit[]> {
    console.log(
      `commit extraction for repo ${JSON.stringify(
        repository,
      )} from ${JSON.stringify(from)} to ${JSON.stringify(to)}`,
    );

    const githubCommits = await axios
      .get(
        `https://api.github.com/repos/${repository.name}/compare/${from.selector}...${to.selector}`,
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
          return response.data.commits as GithubCommit[];
        }
        throw new Error(`Error while comparing. ${response}`);
      });

    return this.toCommits(githubCommits);
  }

  private async toCommits(githubCommits: GithubCommit[]): Promise<Commit[]> {
    return githubCommits.map((ghCommit) => {
      return {
        message: ghCommit.commit.message,
        id: ghCommit.html_url,
        committer: {
          name: ghCommit.commit.author.name,
          email: ghCommit.commit.committer.email,
        },
      };
    });
  }
}

type GithubCommit = {
  html_url: string;
  commit: {
    message: string;
    author: {
      name: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
  };
};
