import { Module } from '@nestjs/common';
import { BOM_EXPORTER } from '../../domain/bom-changelog-exporter/port/bom-exporter';
import { ConfluenceExporter } from './confluence-exporter.service';
import { ConfigModule } from '@nestjs/config';
import { validateConfluenceExporterEnvVars } from './configuration/confluence-exporter-env-vars.validation';
import { ConfluenceExporterConfigurationService } from './configuration/confluence-exporter-configuration.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        `${process.env.HOME}/.changelog/${process.env.BOM_CONTEXT}/.env.confluence-bom-change-log-exporter-adapter`,
        `envs/test/.env.confluence-bom-change-log-exporter-adapter`,
      ],
      isGlobal: false,
      validate: validateConfluenceExporterEnvVars,
    }),
  ],
  providers: [
    ConfluenceExporterConfigurationService,
    { provide: BOM_EXPORTER, useClass: ConfluenceExporter },
  ],
  exports: [BOM_EXPORTER],
})
export class BomChangelogExporterAdapterModule {}
