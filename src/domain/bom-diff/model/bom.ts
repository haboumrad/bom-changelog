export type BOMDiffRequest = {
  bomRepository: Repository;
  from: Version;
  to: Version;
};

export type BOMDiffResponse = {
  request: BOMDiffRequest;
  bomDiffUrl: string;
  systems: RepositoryDiffStatus[];
};

export type RepositoryDiffStatus = {
  systemRepository: Repository;
  status: RepoStatus;
  versions: {
    from?: Version;
    to?: Version;
  };
};

export type Repository = {
  label: string;
  name: string;
  url?: string;
};

export type Version = {
  selector: string;
};

export type BOMParseResult = {
  bom: RepositoryVersion;
  systems: RepositoryVersion[];
};

export type RepositoryVersion = {
  repository: Repository;
  version: Version;
};

export enum RepoStatus {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
  UNCHANGED = 'UNCHANGED',
}
