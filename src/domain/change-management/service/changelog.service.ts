import { Inject, Injectable } from '@nestjs/common';
import { ChangeLog, ChangeWithCommit } from '../model/Changelog';
import { ConventionalCommit } from '../../repository-commit-parser/model/Commit';
import { CHANGE_EXTRACTOR, ChangeExtractor } from '../port/change-extractor';

@Injectable()
export class ChangeLogService {
  constructor(
    @Inject(CHANGE_EXTRACTOR)
    private readonly changeExtractor: ChangeExtractor,
  ) {}

  async getChangeLog(commits: ConventionalCommit[]): Promise<ChangeLog> {
    const changes: ChangeWithCommit[] = [];
    for (const commit of commits) {
      const id = commit.scope;
      try {
        const change = await this.changeExtractor.getChange(id);
        changes.push({
          conventionalCommit: commit,
          change,
        });
      } catch (e) {
        console.warn(
          `Error while fetching issue details for ${id}: ${JSON.stringify(e)}`,
        );
        changes.push({
          conventionalCommit: commit,
        });
      }
    }
    return { changeLog: changes };
  }
}
