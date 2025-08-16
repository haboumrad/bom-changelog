import { Repository, Version } from '../../bom-diff/model/bom';
import { RepositoryChangeLog } from '../../bom-changelog-generator/model/bom-changelog';
import { ChangeLogOptions } from '../../../application/command-line/configuration/command-line-configuration.service';

export const BOM_EXPORTER = 'BOM_EXPORTER';
export interface BomExporter {
  getOrCreateBomPageReleaseNote(
    releaseNotePageName: string,
    bomRepository: Repository,
    from: Version,
    to: Version,
    bomDiffUrl: string,
    systemPages: SystemPageWithChangeLog[],
    changeLogOptions: ChangeLogOptions,
  ): Promise<BomPageId>;

  getOrCreateSystemPage(systemPageName: string): Promise<SystemPageId>;

  getOrCreateSystemPageReleaseNote(
    parentSystemPageId: string,
    releaseNotePageName: string,
    repositoryChangeLog: RepositoryChangeLog,
  ): Promise<SystemPageId>;
}

export type BomPageId = string;
export type SystemPageId = string;

export type SystemPageWithChangeLog = {
  pageId?: SystemPageId;
  pageName?: string;
  repositoryChangeLog: RepositoryChangeLog;
};
