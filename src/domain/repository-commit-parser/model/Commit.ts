export type ConventionalCommit = {
  commit: Commit;
  scope: string;
  subject: string;
  type: string;
};

export type Commit = {
  message: string;
  committer: {
    name: string;
    email: string;
  };
};
