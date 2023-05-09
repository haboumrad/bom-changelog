import {
  Repository,
  RepositoryDiffStatus,
  Version,
} from '../../bom-diff/model/bom';
import { ChangeLog } from '../../change-management/model/Changelog';

export type BOMChangeLogRequest = {
  bomRepository: Repository;
  from: Version;
  to: Version;
};

export type BOMChangeLogResponse = {
  request: BOMChangeLogRequest;
  bomDiffUrl: string;
  systems: RepositoryChangeLog[];
};

export type RepositoryChangeLog = ChangeLog & {
  repository: RepositoryDiffStatus;
  repositoryDiffUrl: string;
};
