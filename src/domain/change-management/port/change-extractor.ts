import { Change } from '../model/Changelog';

export const CHANGE_EXTRACTOR = 'CHANGE_EXTRACTOR';
export interface ChangeExtractor {
  getChange(id: string): Promise<Change>;
}
