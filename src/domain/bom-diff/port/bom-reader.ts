import { RepositoryVersion } from '../model/bom';

export const BOM_READER = 'BOM_READER';
export interface BomReader {
  readFile(repoVersion: RepositoryVersion): Promise<string>;
  resolveBomUrl(repositoryName: string): string;
  resolveBomDiffUrl(
    repositoryName: string,
    fromVersion: string,
    toVersion: string,
  ): string;
}
