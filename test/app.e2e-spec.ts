import { TestingModule } from '@nestjs/testing';
import { CommandLineModule } from '../src/application/command-line/command-line.module';
import axios from 'axios';

import mockGitBomReadFileFrom200 from './bom-diff-adapter/readFileFrom_200.json';
import mockGitBomReadFileTo200 from './bom-diff-adapter/readFileTo_200.json';
import mockGitRepoDiffCommits200 from './repository-commit-parser-adapter/getCommits_sample-sys1_200.json';
import mockJiraValidChange200 from './change-management-adapter/getChange_200.json';
import mockJiraChangeNotFound200 from './change-management-adapter/getChange_not_found_200.json';
import mockConfluenceGetSystemPage200 from './bom-changelog-exporter-adapter/get_sample-sys1_page_200.json';
import mockConfluenceGetReleaseNoteSystemPageNotFound200 from './bom-changelog-exporter-adapter/get_release_note_sample-sys1_page_not_found_200.json';
import mockConfluencePostReleaseNoteSystemPage200 from './bom-changelog-exporter-adapter/post_release_note_sample-sys1_page_200.json';
import mockConfluenceGetReleaseNoteBomPageNotFound200 from './bom-changelog-exporter-adapter/get_release_note_bom_page_not_found_200.json';
import mockConfluencePostReleaseNoteBomPage200 from './bom-changelog-exporter-adapter/post_release_note_bom_page_200.json';
import { CommandTestFactory } from 'nest-commander-testing';

describe('Github, Jira and Confluence adapters (e2e)', () => {
  let commandInstance: TestingModule;
  const spyAxiosGet = jest.spyOn(axios, 'get');
  const spyAxiosPost = jest.spyOn(axios, 'post');

  beforeEach(async () => {
    commandInstance = await CommandTestFactory.createTestingCommand({
      imports: [CommandLineModule],
    }).compile();
  });

  it('command line service nominal case, one system updated', async () => {
    //GIVEN
    // GIT
    spyAxiosGet.mockResolvedValueOnce(mockGitBomReadFileFrom200.response);
    spyAxiosGet.mockResolvedValueOnce(mockGitBomReadFileTo200.response);
    spyAxiosGet.mockResolvedValueOnce(mockGitRepoDiffCommits200.response);
    //JIRA
    spyAxiosGet.mockResolvedValueOnce(mockJiraValidChange200.response);
    spyAxiosGet.mockResolvedValueOnce(mockJiraChangeNotFound200.response);
    //CONFLUENCE
    spyAxiosGet.mockResolvedValueOnce(mockConfluenceGetSystemPage200.response);
    spyAxiosGet.mockResolvedValueOnce(
      mockConfluenceGetReleaseNoteSystemPageNotFound200.response,
    );
    spyAxiosPost.mockResolvedValueOnce(
      mockConfluencePostReleaseNoteSystemPage200.response,
    );
    spyAxiosGet.mockResolvedValueOnce(
      mockConfluenceGetReleaseNoteBomPageNotFound200.response,
    );
    spyAxiosPost.mockResolvedValueOnce(
      mockConfluencePostReleaseNoteBomPage200.response,
    );

    //WHEN
    await CommandTestFactory.run(commandInstance, [
      'changelog',
      '--repo-label',
      'bom-sample',
      '--repo-name',
      'haboumrad/bom-sample',
      '--from',
      '0.0.2',
      '--to',
      '0.0.3',
    ]);

    //THEN
    expect(spyAxiosGet).toHaveBeenCalledTimes(8);
    expect(spyAxiosPost).toHaveBeenCalledTimes(2);

    // GIT
    expect(spyAxiosGet).toHaveBeenNthCalledWith(
      1,
      mockGitBomReadFileFrom200.request.url,
      mockGitBomReadFileFrom200.request.headers,
    );
    expect(spyAxiosGet).toHaveBeenNthCalledWith(
      2,
      mockGitBomReadFileTo200.request.url,
      mockGitBomReadFileTo200.request.headers,
    );
    expect(spyAxiosGet).toHaveBeenNthCalledWith(
      3,
      mockGitRepoDiffCommits200.request.url,
      mockGitRepoDiffCommits200.request.headers,
    );

    //JIRA
    expect(spyAxiosGet).toHaveBeenNthCalledWith(
      4,
      mockJiraValidChange200.request.url,
      mockJiraValidChange200.request.headers,
    );
    expect(spyAxiosGet).toHaveBeenNthCalledWith(
      5,
      mockJiraChangeNotFound200.request.url,
      mockJiraChangeNotFound200.request.headers,
    );

    //CONFLUENCE
    expect(spyAxiosGet).toHaveBeenNthCalledWith(
      6,
      mockConfluenceGetSystemPage200.request.url,
      mockConfluenceGetSystemPage200.request.headers,
    );
    expect(spyAxiosGet).toHaveBeenNthCalledWith(
      7,
      mockConfluenceGetReleaseNoteSystemPageNotFound200.request.url,
      mockConfluenceGetReleaseNoteSystemPageNotFound200.request.headers,
    );
    expect(spyAxiosPost).toHaveBeenNthCalledWith(
      1,
      mockConfluencePostReleaseNoteSystemPage200.request.url,
      mockConfluencePostReleaseNoteSystemPage200.request.body,
      mockConfluencePostReleaseNoteSystemPage200.request.headers,
    );
    expect(spyAxiosGet).toHaveBeenNthCalledWith(
      8,
      mockConfluenceGetReleaseNoteBomPageNotFound200.request.url,
      mockConfluenceGetReleaseNoteBomPageNotFound200.request.headers,
    );
    expect(spyAxiosPost).toHaveBeenNthCalledWith(
      2,
      mockConfluencePostReleaseNoteBomPage200.request.url,
      mockConfluencePostReleaseNoteBomPage200.request.body,
      mockConfluencePostReleaseNoteBomPage200.request.headers,
    );
  });
});
