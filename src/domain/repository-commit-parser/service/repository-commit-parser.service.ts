import { Inject, Injectable } from '@nestjs/common';
import { RepositoryDiffStatus } from '../../bom-diff/model/bom';
import { COMMIT_EXTRACTOR, CommitExtractor } from '../port/commit-extractor';
import { isConventionalCommit, ParsedCommit } from '../model/Commit';

import * as conventionalCommitsParser from 'conventional-commits-parser';
import { randomUUID } from 'crypto';

@Injectable()
export class RepositoryCommitParserService {
  constructor(
    @Inject(COMMIT_EXTRACTOR)
    private readonly commitExtractor: CommitExtractor,
  ) {}

  async getParsedCommits(
    repoVersion: RepositoryDiffStatus,
  ): Promise<ParsedCommit[]> {
    const commits = await this.commitExtractor.getCommits(
      repoVersion.systemRepository,
      repoVersion.versions.from,
      repoVersion.versions.to,
    );
    const result = new Map<string, ParsedCommit>(
      commits.map((commit) => {
        const parsedCommit = conventionalCommitsParser.sync(commit.message);
        if (isConventionalCommit(parsedCommit)) {
          const scope = parsedCommit.scope;
          return [
            scope,
            {
              commit,
              scope,
              subject: parsedCommit?.subject?.trim(),
              type: parsedCommit.type,
            },
          ];
        }
        return [randomUUID(), commit];
      }),
    );
    return Array.from(result.values());
  }

  getRepositoryUrl(repositoryName: string): string {
    return this.commitExtractor.resolveRepositoryUrl(repositoryName);
  }

  getRepositoryDiffUrl(
    repositoryName: string,
    fromVersion: string,
    toVersion: string,
  ): string {
    return this.commitExtractor.resolveRepositoryDiffUrl(
      repositoryName,
      fromVersion,
      toVersion,
    );
  }
}
