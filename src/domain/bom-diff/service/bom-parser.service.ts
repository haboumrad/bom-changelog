import * as YAML from 'yaml';
import { Inject, Injectable } from '@nestjs/common';
import { BOM_READER, BomReader } from '../port/bom-reader';
import { BOMParseResult, RepositoryVersion } from '../model/bom';

@Injectable()
export class BomParserService {
  constructor(@Inject(BOM_READER) private readonly bomReader: BomReader) {}

  async readBom(bomVersion: RepositoryVersion): Promise<BOMParseResult> {
    const bomContent = await this.bomReader.readFile(bomVersion);
    const parsedBomContent = YAML.parse(bomContent) as SystemsVersion;
    const systems = parsedBomContent.systems.map((systemVersion) => {
      return {
        repository: {
          label: systemVersion.name,
          name: systemVersion.url,
        },
        version: {
          selector: systemVersion.version,
        },
      } as RepositoryVersion;
    });
    return {
      bom: {
        version: bomVersion.version,
        repository: {
          label: bomVersion.repository.label,
          name: bomVersion.repository.name,
          url: this.bomReader.resolveBomUrl(bomVersion.repository.name),
        },
      },
      systems,
    };
  }
}

type SystemsVersion = {
  systems: SystemVersion[];
};

type SystemVersion = {
  name: string;
  version: string;
  url: string;
};
