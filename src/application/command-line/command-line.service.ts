import { Injectable } from '@nestjs/common';
import { AppEntrypointService } from '../../domain/app-entrypoint/app-entrypoint.service';
import { CommandLineConfigurationService } from './configuration/command-line-configuration.service';

@Injectable()
export class CommandLineService {
  constructor(
    private readonly configuration: CommandLineConfigurationService,
    private readonly appEntrypointService: AppEntrypointService,
  ) {}

  async run(): Promise<void> {
    return this.appEntrypointService.exportChangeLog(
      this.configuration.getChangeLogRequest(),
    );
  }
}
