import { Injectable } from '@nestjs/common';
import { ChangeWithCommit } from '../../domain/change-management/model/Changelog';
import {
  BomExporter,
  BomPageId,
  SystemPageId,
  SystemPageWithChangeLog,
} from '../../domain/bom-changelog-exporter/port/bom-exporter';
import { RepositoryChangeLog } from 'src/domain/bom-changelog-generator/model/bom-changelog';
import { Repository, RepoStatus, Version } from 'src/domain/bom-diff/model/bom';
import { ConfluenceContentBuilder } from './confluence-content-builder';
import axios from 'axios';
import {
  ConfluenceExporterConfiguration,
  ConfluenceExporterConfigurationService,
} from './configuration/confluence-exporter-configuration.service';
import {
  Commit,
  ConventionalCommit,
} from '../../domain/repository-commit-parser/model/Commit';
import { ChangeLogOptions } from '../../application/command-line/configuration/command-line-configuration.service';

@Injectable()
export class ConfluenceExporter implements BomExporter {
  private readonly configuration: ConfluenceExporterConfiguration;
  private readonly basicAuth: string;
  constructor(
    private readonly configurationService: ConfluenceExporterConfigurationService,
  ) {
    this.configuration = this.configurationService.getConfig();
    this.basicAuth = `Basic ${this.getBasicAuth()}`;
  }

  async getOrCreateBomPageReleaseNote(
    releaseNotePageName: string,
    bomRepository: Repository,
    from: Version,
    to: Version,
    bomDiffUrl: string,
    systemPages: SystemPageWithChangeLog[],
    changeLogOptions: ChangeLogOptions,
  ): Promise<BomPageId> {
    const { spaceKey, spaceId, pageId } = this.configuration.pages.boms;
    const bomReleaseNotePageId = await this.getPage(
      spaceKey,
      pageId,
      releaseNotePageName,
    );
    if (bomReleaseNotePageId === undefined) {
      const pageContent = this.generateBomContent(
        bomRepository,
        from,
        to,
        bomDiffUrl,
        systemPages,
        changeLogOptions,
      );
      console.log(`generating bom release note page [${releaseNotePageName}]`);
      return this.createPage(spaceId, pageId, releaseNotePageName, pageContent);
    }
    console.log(
      `returning existing bom release note page ${releaseNotePageName} with id ${bomReleaseNotePageId}`,
    );
    return bomReleaseNotePageId;
  }

  async getOrCreateSystemPage(systemPageName: string): Promise<SystemPageId> {
    const { spaceId, spaceKey, pageId } = this.configuration.pages.systems;
    const systemPageId = await this.getPage(spaceKey, pageId, systemPageName);
    if (systemPageId === undefined) {
      console.log(`generating system page ${systemPageName}`);
      return this.createPage(spaceId, pageId, systemPageName, '');
    }
    console.log(
      `returning existing system page ${systemPageName} with id ${systemPageId}`,
    );
    return systemPageId;
  }

  async getOrCreateSystemPageReleaseNote(
    parentSystemPageId: string,
    releaseNotePageName: string,
    repositoryChangeLog: RepositoryChangeLog,
  ): Promise<SystemPageId> {
    const { spaceKey } = this.configuration.pages.systems;
    const systemReleaseNotePageId = await this.getPage(
      spaceKey,
      parentSystemPageId,
      releaseNotePageName,
    );
    if (systemReleaseNotePageId === undefined) {
      const pageContent = this.generateSystemContent(repositoryChangeLog);
      console.log(
        `generating system release note page [${releaseNotePageName}]`,
      );
      return this.createPage(
        this.configuration.pages.systems.spaceId,
        parentSystemPageId,
        releaseNotePageName,
        pageContent,
      );
    }
    console.log(
      `returning existing release note system page ${releaseNotePageName} with id ${systemReleaseNotePageId}`,
    );
    return systemReleaseNotePageId;
  }

  private getBasicAuth(): string {
    return Buffer.from(
      `${this.configuration.confluenceUser}:${this.configuration.confluenceToken}`,
    ).toString('base64');
  }

  private async getPage(
    spaceKey: string,
    parentPageId: string,
    pageName: string,
  ): Promise<SystemPageId> {
    const searchUrl = `${this.configuration.confluenceUrl}/wiki/rest/api/content/search?cql=space=${spaceKey}+and+title="${pageName}"+and+type=page+and+parent=${parentPageId}&limit=1`;
    try {
      return axios
        .get(searchUrl, {
          headers: {
            Accept: 'application/json',
            Authorization: this.basicAuth,
          },
        })
        .then((response) => {
          if (response.status == 200) {
            return response.data as ConfluenceSearchResult;
          }
          throw new Error(
            `Error while searching page ${pageName}: ${response}`,
          );
        })
        .then((searchResult) => searchResult.results[0]?.id);
    } catch (e) {
      console.log(e);
    }
  }

  private async createPage(
    spaceId: string,
    parentPageId: string,
    pageName: string,
    pageContent: string,
  ): Promise<SystemPageId | undefined> {
    const createPageUrl = `${this.configuration.confluenceUrl}/wiki/api/v2/pages?serialize-ids-as-strings=true`;
    return axios
      .post(
        createPageUrl,
        {
          spaceId,
          status: 'current',
          title: pageName,
          parentId: parentPageId,
          body: {
            representation: 'storage',
            value: pageContent,
          },
        },
        {
          headers: {
            Accept: 'application/json',
            Authorization: this.basicAuth,
          },
        },
      )
      .then((response) => {
        if (response.status == 200) {
          return response.data.id.toString() as string;
        }
        console.warn(`Error while creating page ${pageName}: ${response}`);
        return undefined;
      })
      .catch((reason) => {
        console.error(`Error while creating page: ${reason}`);
        return undefined;
      });
  }

  private generateSystemContent(
    repositoryChangeLog: RepositoryChangeLog,
  ): string {
    const contentBuilder = new ConfluenceContentBuilder();
    contentBuilder.appendHeading('Release note');
    contentBuilder.appendTableStart([
      'System repository url',
      'From',
      'To',
      'System repository diff url',
    ]);
    contentBuilder.appendTableLineStart();
    contentBuilder.appendTableLineColumnStart();
    contentBuilder.appendLinkExternalUrl(
      repositoryChangeLog.repository.systemRepository.label,
      repositoryChangeLog.repository.systemRepository.url,
    );
    contentBuilder.appendTableLineColumnEnd();
    contentBuilder.appendTableLineColumnStart();
    contentBuilder.appendParagraph(
      repositoryChangeLog.repository.versions.from?.selector,
    );
    contentBuilder.appendTableLineColumnEnd();
    contentBuilder.appendTableLineColumnStart();
    contentBuilder.appendParagraph(
      repositoryChangeLog.repository.versions.to.selector,
    );
    contentBuilder.appendTableLineColumnEnd();
    contentBuilder.appendTableLineColumnStart();
    contentBuilder.appendLinkExternalUrl(
      'compare url',
      repositoryChangeLog.repositoryDiffUrl,
    );
    contentBuilder.appendTableLineColumnEnd();
    contentBuilder.appendTableLineEnd();
    contentBuilder.appendTableEnd();
    this.generateChangeLogTable(
      'Changelog',
      contentBuilder,
      repositoryChangeLog.validChangeLog,
    );
    this.generateFilteredChangeLogTable(
      'Filtered changelog',
      contentBuilder,
      repositoryChangeLog.filteredChangeLog,
    );
    this.generateUnprocessedCommitsTable(
      'Unprocessed commits',
      contentBuilder,
      repositoryChangeLog.invalidChangeLog,
    );
    return contentBuilder.build();
  }

  private generateUnprocessedCommitsTable(
    sectionName: string,
    contentBuilder: ConfluenceContentBuilder,
    unprocessedCommits: Commit[],
  ) {
    if (unprocessedCommits.length === 0) {
      return;
    }
    contentBuilder.appendHeading(sectionName);
    contentBuilder.appendTableStart(['Message', 'Committer']);
    unprocessedCommits.forEach((commit) => {
      contentBuilder.appendTableLineStart();
      contentBuilder.appendTableLineColumnStart();
      contentBuilder.appendLinkExternalUrl(commit.message, commit.id);
      contentBuilder.appendTableLineColumnEnd();
      contentBuilder.appendTableLineColumnStart();
      contentBuilder.appendParagraph(commit.committer.name);
      contentBuilder.appendTableLineColumnEnd();
      contentBuilder.appendTableLineEnd();
    });
    contentBuilder.appendTableEnd();
  }

  private generateFilteredChangeLogTable(
    sectionName: string,
    contentBuilder: ConfluenceContentBuilder,
    filteredChangeLog: ConventionalCommit[],
  ) {
    if (filteredChangeLog.length === 0) {
      return;
    }
    contentBuilder.appendHeading(sectionName);
    contentBuilder.appendTableStart(['Key', 'Type', 'Summary', 'Committer']);
    filteredChangeLog.forEach((conventionalCommit) => {
      contentBuilder.appendTableLineStart();
      contentBuilder.appendTableLineColumnStart();
      contentBuilder.appendParagraph(conventionalCommit.scope);
      contentBuilder.appendTableLineColumnEnd();
      contentBuilder.appendTableLineColumnStart();
      contentBuilder.appendParagraph(conventionalCommit.type);
      contentBuilder.appendTableLineColumnEnd();
      contentBuilder.appendTableLineColumnStart();
      contentBuilder.appendParagraph(conventionalCommit.subject);
      contentBuilder.appendTableLineColumnEnd();
      contentBuilder.appendTableLineColumnStart();
      contentBuilder.appendParagraph(conventionalCommit.commit.committer.name);
      contentBuilder.appendTableLineColumnEnd();
      contentBuilder.appendTableLineEnd();
    });
    contentBuilder.appendTableEnd();
  }

  private generateDeploymentImpactTable(
    sectionName: string,
    contentBuilder: ConfluenceContentBuilder,
    systemPages: SystemPageWithChangeLog[],
  ): void {
    contentBuilder.appendHeading(sectionName);
    contentBuilder.appendTableStart(['System', 'Key', 'Summary', 'Impact']);
    systemPages.forEach((system) => {
      system.repositoryChangeLog.validChangeLog.forEach((changeWithCommit) => {
        const changeDeploymentImpact =
          this.getChangeDeploymentImpact(changeWithCommit);
        if (changeDeploymentImpact) {
          contentBuilder.appendTableLineStart();
          contentBuilder.appendTableLineColumnStart();
          const repoStatus = system.repositoryChangeLog.repository.status;
          contentBuilder.appendParagraph(
            system.repositoryChangeLog.repository.systemRepository.label,
            repoStatus,
          );
          contentBuilder.appendTableLineColumnEnd();
          contentBuilder.appendTableLineColumnStart();
          const [id, url] = this.getChangeId(changeWithCommit);
          if (changeWithCommit.change) {
            contentBuilder.appendLinkExternalUrl(id, url);
          } else {
            contentBuilder.appendParagraph(id);
          }
          contentBuilder.appendTableLineColumnEnd();
          contentBuilder.appendTableLineColumnStart();
          contentBuilder.appendParagraph(
            this.getChangeSummary(changeWithCommit),
          );
          contentBuilder.appendTableLineColumnEnd();
          contentBuilder.appendTableLineColumnStart();
          contentBuilder.appendParagraph(changeDeploymentImpact);
          contentBuilder.appendTableLineColumnEnd();
          contentBuilder.appendTableLineEnd();
        }
      });
    });
    contentBuilder.appendTableEnd();
  }

  private generateUntestedTable(
    sectionName: string,
    contentBuilder: ConfluenceContentBuilder,
    systemPages: SystemPageWithChangeLog[],
    changeLogOptions: ChangeLogOptions,
  ): void {
    contentBuilder.appendHeading(sectionName);
    contentBuilder.appendTableStart([
      'System',
      'Key',
      'Summary',
      'Status',
      'Committer',
      'Change Assignee',
    ]);
    systemPages.forEach((system) => {
      for (const changeWithCommit of system.repositoryChangeLog
        .validChangeLog) {
        const changeStatus = this.getChangeStatus(changeWithCommit);

        if (
          changeLogOptions.changeManagement.safeToDeployStatus.includes(
            changeStatus,
          )
        ) {
          continue;
        }

        contentBuilder.appendTableLineStart();
        contentBuilder.appendTableLineColumnStart();
        const repoStatus = system.repositoryChangeLog.repository.status;
        contentBuilder.appendParagraph(
          system.repositoryChangeLog.repository.systemRepository.label,
          repoStatus,
        );
        contentBuilder.appendTableLineColumnEnd();
        contentBuilder.appendTableLineColumnStart();
        const [id, url] = this.getChangeId(changeWithCommit);
        if (changeWithCommit.change) {
          contentBuilder.appendLinkExternalUrl(id, url);
        } else {
          contentBuilder.appendParagraph(id);
        }
        contentBuilder.appendTableLineColumnEnd();
        contentBuilder.appendTableLineColumnStart();
        contentBuilder.appendParagraph(this.getChangeSummary(changeWithCommit));
        contentBuilder.appendTableLineColumnEnd();
        contentBuilder.appendTableLineColumnStart();
        contentBuilder.appendParagraph(changeStatus);
        contentBuilder.appendTableLineColumnEnd();
        contentBuilder.appendTableLineColumnStart();
        contentBuilder.appendParagraph(
          changeWithCommit.conventionalCommit.commit.committer.name,
        );
        contentBuilder.appendTableLineColumnEnd();
        contentBuilder.appendTableLineColumnStart();
        contentBuilder.appendParagraph(changeWithCommit.change.assignee);
        contentBuilder.appendTableLineColumnEnd();
        contentBuilder.appendTableLineEnd();
      }
    });
    contentBuilder.appendTableEnd();
  }

  private generateChangeLogTable(
    sectionName: string,
    contentBuilder: ConfluenceContentBuilder,
    validChangeLog: ChangeWithCommit[],
  ): void {
    contentBuilder.appendHeading(sectionName);
    contentBuilder.appendTableStart(['Key', 'Type', 'Summary', 'Committer']);
    validChangeLog.forEach((changeWithCommit) => {
      contentBuilder.appendTableLineStart();
      contentBuilder.appendTableLineColumnStart();
      const [id, url] = this.getChangeId(changeWithCommit);
      if (changeWithCommit.change) {
        contentBuilder.appendLinkExternalUrl(id, url);
      } else {
        contentBuilder.appendParagraph(id);
      }
      contentBuilder.appendTableLineColumnEnd();
      contentBuilder.appendTableLineColumnStart();
      contentBuilder.appendParagraph(this.getChangeType(changeWithCommit));
      contentBuilder.appendTableLineColumnEnd();
      contentBuilder.appendTableLineColumnStart();
      contentBuilder.appendParagraph(this.getChangeSummary(changeWithCommit));
      contentBuilder.appendTableLineColumnEnd();
      contentBuilder.appendTableLineColumnStart();
      contentBuilder.appendParagraph(
        changeWithCommit.conventionalCommit.commit.committer.name,
      );
      contentBuilder.appendTableLineColumnEnd();
      contentBuilder.appendTableLineEnd();
    });
    contentBuilder.appendTableEnd();
  }

  private getChangeId(changeWithCommit: ChangeWithCommit): [string, string] {
    if (changeWithCommit.change) {
      return [changeWithCommit.change.id, changeWithCommit.change.url];
    }
    return [changeWithCommit.conventionalCommit.scope, ''];
  }

  private getChangeType(changeWithCommit: ChangeWithCommit): string {
    if (changeWithCommit.change) {
      return changeWithCommit.change.type;
    }
    return changeWithCommit.conventionalCommit.type;
  }

  private getChangeStatus(changeWithCommit: ChangeWithCommit): string {
    if (changeWithCommit.change) {
      return changeWithCommit.change.status;
    }
    return 'N/A';
  }

  private getChangeSummary(changeWithCommit: ChangeWithCommit): string {
    if (changeWithCommit.change) {
      return changeWithCommit.change.summary;
    }
    return changeWithCommit.conventionalCommit.subject;
  }

  private getChangeDeploymentImpact(
    changeWithCommit: ChangeWithCommit,
  ): string {
    if (changeWithCommit.change) {
      return changeWithCommit.change.deploymentImpact;
    }
    return undefined;
  }

  private generateBomContent(
    bomRepository: Repository,
    from: Version,
    to: Version,
    bomDiffUrl: string,
    systemPages: SystemPageWithChangeLog[],
    changeLogOptions: ChangeLogOptions,
  ): string {
    const contentBuilder = new ConfluenceContentBuilder();
    contentBuilder.appendHeading('Release note');
    contentBuilder.appendTableStart([
      'Bom repository url',
      'From',
      'To',
      'Bom repository diff url',
    ]);
    contentBuilder.appendTableLineStart();
    contentBuilder.appendTableLineColumnStart();
    contentBuilder.appendLinkExternalUrl(
      bomRepository.label,
      bomRepository.url,
    );
    contentBuilder.appendTableLineColumnEnd();
    contentBuilder.appendTableLineColumnStart();
    contentBuilder.appendParagraph(from.selector);
    contentBuilder.appendTableLineColumnEnd();
    contentBuilder.appendTableLineColumnStart();
    contentBuilder.appendParagraph(to.selector);
    contentBuilder.appendTableLineColumnEnd();
    contentBuilder.appendTableLineColumnStart();
    contentBuilder.appendLinkExternalUrl('compare url', bomDiffUrl);
    contentBuilder.appendTableLineColumnEnd();
    contentBuilder.appendTableLineEnd();
    contentBuilder.appendTableEnd();

    contentBuilder.appendHeading('Legend');
    contentBuilder.appendParagraph(
      'Black: System not changed in this bom version',
      RepoStatus.UNCHANGED,
    );
    contentBuilder.appendParagraph(
      'Blue: System has changed in this bom version',
      RepoStatus.UPDATED,
    );
    contentBuilder.appendParagraph(
      'Green: System has been added in this bom version',
      RepoStatus.CREATED,
    );

    this.generateDeploymentImpactTable(
      'Deployment impacts',
      contentBuilder,
      systemPages,
    );

    if (changeLogOptions.changeManagement.safeToDeployStatus) {
      this.generateUntestedTable(
        'Untested issues',
        contentBuilder,
        systemPages,
        changeLogOptions,
      );
    }

    contentBuilder.appendHeading('Changelog');
    contentBuilder.appendTableStart([
      'System',
      'Status',
      'From',
      'To',
      'Release note',
    ]);
    systemPages.forEach((systemPage) => {
      const repoStatus = systemPage.repositoryChangeLog.repository.status;
      contentBuilder.appendTableLineStart();
      //system
      contentBuilder.appendTableLineColumnStart();

      contentBuilder.appendParagraph(
        systemPage.repositoryChangeLog.repository.systemRepository.label,
        repoStatus,
      );
      contentBuilder.appendTableLineColumnEnd();
      //status
      contentBuilder.appendTableLineColumnStart();
      contentBuilder.appendParagraph(repoStatus.toString(), repoStatus);
      contentBuilder.appendTableLineColumnEnd();
      //from
      contentBuilder.appendTableLineColumnStart();
      const from = systemPage.repositoryChangeLog.repository.versions.from;
      contentBuilder.appendParagraph(from ? from.selector : '-', repoStatus);
      contentBuilder.appendTableLineColumnEnd();
      //to
      contentBuilder.appendTableLineColumnStart();
      const to = systemPage.repositoryChangeLog.repository.versions.to;
      contentBuilder.appendParagraph(to ? to.selector : '-', repoStatus);
      contentBuilder.appendTableLineColumnEnd();
      //release note link
      contentBuilder.appendTableLineColumnStart();
      if (repoStatus === RepoStatus.UNCHANGED) {
        contentBuilder.appendParagraph('-', repoStatus);
      } else {
        contentBuilder.appendConfluenceLink(
          systemPage.pageName,
          systemPage.pageName,
        );
      }
      contentBuilder.appendTableLineColumnEnd();
      contentBuilder.appendTableLineEnd();
    });
    contentBuilder.appendTableEnd();
    return contentBuilder.build();
  }
}

type ConfluenceSearchResult = {
  results: { id: string }[];
};
