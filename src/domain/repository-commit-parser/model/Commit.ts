import * as conventionalCommitsParser from 'conventional-commits-parser';

export type ParsedCommit = Commit | ConventionalCommit;

export type ConventionalCommit = {
  commit: Commit;
  scope: string;
  subject: string;
  type: string;
};

export type Commit = {
  message: string;
  id: string;
  committer: {
    name: string;
    email: string;
  };
};

export const isConventionalCommit = (
  commit:  conventionalCommitsParser.Commit
): commit is ConventionalCommit =>
  Boolean((commit as ConventionalCommit).scope);
