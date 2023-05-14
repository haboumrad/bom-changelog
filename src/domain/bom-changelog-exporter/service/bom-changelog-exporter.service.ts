import { Inject, Injectable } from '@nestjs/common';
import { BOMChangeLogResponse } from '../../bom-changelog-generator/model/bom-changelog';
import {
  BOM_EXPORTER,
  BomExporter,
  SystemPageWithChangeLog,
} from '../port/bom-exporter';
import { RepoStatus } from '../../bom-diff/model/bom';

@Injectable()
export class BomChangelogExporterService {
  constructor(
    @Inject(BOM_EXPORTER)
    private readonly bomExporter: BomExporter,
  ) {}

  async exportChangeLog(bomChangeLog: BOMChangeLogResponse): Promise<void> {
    console.log(`Exporting bom changelog`);
    const systemPages: SystemPageWithChangeLog[] = [];
    for (const repositoryChangeLog of bomChangeLog.systems) {
      if (repositoryChangeLog.repository.status === RepoStatus.UNCHANGED) {
        systemPages.push({
          repositoryChangeLog,
        });
        continue;
      }
      const systemPageName =
        repositoryChangeLog.repository.systemRepository.label;
      const systemPageId = await this.bomExporter.getOrCreateSystemPage(
        systemPageName,
      );
      const systemReleaseNotePageName = this.generateReleaseNotePageName(
        repositoryChangeLog.repository.systemRepository.label,
        repositoryChangeLog.repository.versions.from.selector,
        repositoryChangeLog.repository.versions.to.selector,
      );
      const systemReleaseNotePageId =
        await this.bomExporter.getOrCreateSystemPageReleaseNote(
          systemPageId,
          systemReleaseNotePageName,
          repositoryChangeLog,
        );
      systemPages.push({
        pageId: systemReleaseNotePageId,
        pageName: systemReleaseNotePageName,
        repositoryChangeLog,
      });
    }
    const bomReleaseNotePageName = this.generateReleaseNotePageName(
      bomChangeLog.request.bomRepository.label,
      bomChangeLog.request.from.selector,
      bomChangeLog.request.to.selector,
    );
    await this.bomExporter.getOrCreateBomPageReleaseNote(
      bomReleaseNotePageName,
      bomChangeLog.request.bomRepository,
      bomChangeLog.request.from,
      bomChangeLog.request.to,
      bomChangeLog.bomDiffUrl,
      systemPages,
    );
  }

  private generateReleaseNotePageName(
    repositoryLabel: string,
    repositoryFromVersion: string,
    repositoryToVersion: string,
  ): string {
    return `Release note ${repositoryLabel} ${repositoryFromVersion} ${repositoryToVersion}`;
  }
}
