import { ConventionalCommit } from '../../repository-commit-parser/model/Commit';

export type ChangeLog = {
  changeLog: ChangeWithCommit[];
};

export type ChangeWithCommit = {
  conventionalCommit: ConventionalCommit;
  change?: Change;
};

export type Change = {
  id: string;
  url: string;
  summary: string;
  type: string;
  status: string;
};
