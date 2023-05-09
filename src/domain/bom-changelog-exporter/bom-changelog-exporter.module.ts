import { Module } from '@nestjs/common';
import { BomChangelogExporterService } from './service/bom-changelog-exporter.service';
import { BomChangelogExporterAdapterModule } from '../../infrastructure/bom-changelog-exporter-adapter/bom-changelog-exporter-adapter.module';

@Module({
  imports: [BomChangelogExporterAdapterModule],
  providers: [BomChangelogExporterService],
  exports: [BomChangelogExporterService],
})
export class BomChangelogExporterModule {}
