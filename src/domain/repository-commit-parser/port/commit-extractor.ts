import { Repository, Version } from '../../bom-diff/model/bom';
import { Commit } from '../model/Commit';

export const COMMIT_EXTRACTOR = 'COMMIT_EXTRACTOR';
export interface CommitExtractor {
  getCommits(
    repository: Repository,
    from: Version,
    to: Version,
  ): Promise<Commit[]>;

  resolveRepositoryUrl(repositoryName: string): string;

  resolveRepositoryDiffUrl(
    repositoryName: string,
    fromVersion: string,
    toVersion: string,
  ): string;
}
