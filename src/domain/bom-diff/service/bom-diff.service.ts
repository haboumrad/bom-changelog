import { Inject, Injectable } from '@nestjs/common';
import {
  BOMDiffRequest,
  BOMDiffResponse,
  RepositoryDiffStatus,
  RepositoryVersion,
  RepoStatus,
} from '../model/bom';
import { BomParserService } from './bom-parser.service';
import { BOM_READER, BomReader } from '../port/bom-reader';

@Injectable()
export class BomDiffService {
  constructor(
    private readonly bomParser: BomParserService,
    @Inject(BOM_READER)
    private readonly bomReader: BomReader,
  ) {}

  async getDiff(bomDiffRequest: BOMDiffRequest): Promise<BOMDiffResponse> {
    const bomFrom = await this.bomParser.readBom({
      repository: bomDiffRequest.bomRepository,
      version: bomDiffRequest.from,
    });
    console.debug(`bom from: ${JSON.stringify(bomFrom)}`);

    const bomTo = await this.bomParser.readBom({
      repository: bomDiffRequest.bomRepository,
      version: bomDiffRequest.to,
    });
    console.debug(`bom to: ${JSON.stringify(bomTo)}`);

    const mapFromSystems = new Map(
      bomFrom.systems.map((system) => [system.repository.name, system]),
    );
    const bomDiff = bomTo.systems.map((systemTo) => {
      const systemFrom = mapFromSystems.get(systemTo.repository.name);
      return this.toRepositoryDiffStatus(systemFrom, systemTo);
    });
    console.debug(`BOM diff: ${JSON.stringify(bomDiff)}`);

    return {
      request: { ...bomDiffRequest, bomRepository: bomTo.bom.repository },
      bomDiffUrl: this.bomReader.resolveBomDiffUrl(
        bomTo.bom.repository.name,
        bomFrom.bom.version.selector,
        bomTo.bom.version.selector,
      ),
      systems: bomDiff,
    };
  }

  private toRepositoryDiffStatus(
    systemFrom: RepositoryVersion,
    systemTo: RepositoryVersion,
  ): RepositoryDiffStatus {
    const status = this.computeDiffStatus(systemFrom, systemTo);
    return {
      systemRepository: {
        name: systemTo.repository.name,
        label: systemTo.repository.label,
      },
      versions: {
        from: systemFrom?.version ?? { selector: '-' },
        to: systemTo.version,
      },
      status,
    };
  }

  private computeDiffStatus(
    systemFrom: RepositoryVersion,
    systemTo: RepositoryVersion,
  ) {
    if (systemFrom?.version.selector === systemTo.version.selector) {
      return RepoStatus.UNCHANGED;
    }
    return Boolean(systemFrom) ? RepoStatus.UPDATED : RepoStatus.CREATED;
  }
}
