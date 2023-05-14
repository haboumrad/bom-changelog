import { Inject, Injectable } from '@nestjs/common';
import { ChangeLog, ChangeWithCommit } from '../model/Changelog';
import {
  Commit,
  ConventionalCommit,
  isConventionalCommit,
  ParsedCommit,
} from '../../repository-commit-parser/model/Commit';
import { CHANGE_EXTRACTOR, ChangeExtractor } from '../port/change-extractor';
import { ChangeManagementOptions } from '../../../application/command-line/configuration/command-line-configuration.service';

@Injectable()
export class ChangeLogService {
  constructor(
    @Inject(CHANGE_EXTRACTOR)
    private readonly changeExtractor: ChangeExtractor,
  ) {}

  async getChangeLog(
    commits: ParsedCommit[],
    options: ChangeManagementOptions,
  ): Promise<ChangeLog> {
    const validChangeLog: ChangeWithCommit[] = [];
    const filteredChangeLog: ConventionalCommit[] = [];
    const invalidChangeLog: Commit[] = [];

    for (const commit of commits) {
      if (!isConventionalCommit(commit)) {
        invalidChangeLog.push(commit);
        continue;
      }
      if (!this.matchProjectsFilter(commit.scope, options.projectsPrefix)) {
        console.log(
          `Error ${commit.scope} does not match the project filters: ${options.projectsPrefix}`,
        );
        filteredChangeLog.push(commit);
        continue;
      }
      try {
        const change = await this.changeExtractor.getChange(commit.scope);
        validChangeLog.push({
          conventionalCommit: commit,
          change,
        });
      } catch (e) {
        console.warn(
          `Error while fetching issue details for ${
            commit.scope
          }: ${JSON.stringify(e)}`,
        );
        validChangeLog.push({
          conventionalCommit: commit,
        });
      }
    }
    return { validChangeLog, filteredChangeLog, invalidChangeLog };
  }

  private matchProjectsFilter(id: string, projectsPrefix: string[]): boolean {
    return Boolean(
      projectsPrefix.find((projectPrefix) => id.startsWith(projectPrefix)),
    );
  }
}
