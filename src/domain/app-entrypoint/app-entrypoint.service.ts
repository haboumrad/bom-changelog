import { Injectable } from '@nestjs/common';
import { BomChangelogGeneratorService } from '../bom-changelog-generator/service/bom-changelog-generator.service';
import { BOMChangeLogRequest } from '../bom-changelog-generator/model/bom-changelog';
import { BomChangelogExporterService } from '../bom-changelog-exporter/service/bom-changelog-exporter.service';
import { ChangeLogOptions } from '../../application/command-line/configuration/command-line-configuration.service';

@Injectable()
export class AppEntrypointService {
  constructor(
    private readonly bomChangelogGeneratorService: BomChangelogGeneratorService,
    private readonly bomChangelogExporterService: BomChangelogExporterService,
  ) {}

  async exportChangeLog(
    request: BOMChangeLogRequest,
    changeLogOptions: ChangeLogOptions,
  ): Promise<void> {
    const bomChangeLog =
      await this.bomChangelogGeneratorService.generateChangeLog(
        request,
        changeLogOptions,
      );
    console.log(`====================`);
    console.log(`changelog generation result`);
    console.log(`====================`);
    console.log(`${JSON.stringify(bomChangeLog)}`);
    console.log(`====================`);
    console.log(`changelog export result`);
    console.log(`====================`);
    await this.bomChangelogExporterService.exportChangeLog(bomChangeLog);
  }
}
