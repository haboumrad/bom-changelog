import { Module } from '@nestjs/common';
import { BomChangelogGeneratorModule } from '../bom-changelog-generator/bom-changelog-generator.module';
import { BomChangelogExporterModule } from '../bom-changelog-exporter/bom-changelog-exporter.module';
import { AppEntrypointService } from './app-entrypoint.service';

@Module({
  imports: [BomChangelogGeneratorModule, BomChangelogExporterModule],
  providers: [AppEntrypointService],
  exports: [AppEntrypointService],
})
export class AppEntrypointModule {}
