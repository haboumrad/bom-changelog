import { Injectable } from '@nestjs/common';
import { RepositoryCommitParserService } from '../../repository-commit-parser/service/repository-commit-parser.service';
import { ChangeLogService } from '../../change-management/service/changelog.service';
import { BomDiffService } from '../../bom-diff/service/bom-diff.service';
import {
  BOMChangeLogRequest,
  BOMChangeLogResponse,
  RepositoryChangeLog,
} from '../model/bom-changelog';
import { ChangeLogOptions } from '../../../application/command-line/configuration/command-line-configuration.service';
import { RepoStatus } from '../../bom-diff/model/bom';

@Injectable()
export class BomChangelogGeneratorService {
  constructor(
    private readonly bomDiffService: BomDiffService,
    private readonly repositoryCommitParser: RepositoryCommitParserService,
    private readonly changeLogService: ChangeLogService,
  ) {}

  async generateChangeLog(
    bomChangeLogRequest: BOMChangeLogRequest,
    changeLogOptions: ChangeLogOptions,
  ): Promise<BOMChangeLogResponse> {
    const result: RepositoryChangeLog[] = [];

    const bomDiffResponse = await this.bomDiffService.getDiff(
      bomChangeLogRequest,
    );
    for (const repoDiffStatus of bomDiffResponse.systems) {
      const parsedCommits =
        repoDiffStatus.status === RepoStatus.CREATED
          ? []
          : await this.repositoryCommitParser.getParsedCommits(repoDiffStatus);
      const repoChangeLog =
        repoDiffStatus.status === RepoStatus.CREATED
          ? { validChangeLog: [], filteredChangeLog: [], invalidChangeLog: [] }
          : await this.changeLogService.getChangeLog(
              parsedCommits,
              changeLogOptions.changeManagement,
            );
      result.push({
        repository: {
          status: repoDiffStatus.status,
          versions: repoDiffStatus.versions,
          systemRepository: {
            name: repoDiffStatus.systemRepository.name,
            label: repoDiffStatus.systemRepository.label,
            url: this.repositoryCommitParser.getRepositoryUrl(
              repoDiffStatus.systemRepository.name,
            ),
          },
        },
        repositoryDiffUrl: this.repositoryCommitParser.getRepositoryDiffUrl(
          repoDiffStatus.systemRepository.name,
          repoDiffStatus.versions.from?.selector,
          repoDiffStatus.versions.to.selector,
        ),
        ...repoChangeLog,
      });
    }
    return {
      request: bomDiffResponse.request,
      bomDiffUrl: bomDiffResponse.bomDiffUrl,
      systems: result,
    };
  }
}
