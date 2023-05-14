import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BOMChangeLogRequest } from '../../../domain/bom-changelog-generator/model/bom-changelog';

@Injectable()
export class CommandLineConfigurationService {
  constructor(
    private appConfigService: ConfigService<Record<string, unknown>, true>,
  ) {}

  getChangeLogOptions(): ChangeLogOptions {
    return {
      changeManagement: {
        projectsPrefix: this.appConfigService
          .get<string>('CHANGE_PROJECT_PREFIX_FILTER', {
            infer: true,
          })
          .split(','),
      },
    };
  }

  getChangeLogRequest(): BOMChangeLogRequest {
    return {
      bomRepository: {
        label: this.appConfigService.get<string>('BOM_REPOSITORY_LABEL', {
          infer: true,
        }),
        name: this.appConfigService.get<string>('BOM_REPOSITORY_NAME', {
          infer: true,
        }),
      },
      from: {
        selector: this.appConfigService.get<string>(
          'BOM_REPOSITORY_FROM_VERSION',
          {
            infer: true,
          },
        ),
      },
      to: {
        selector: this.appConfigService.get<string>(
          'BOM_REPOSITORY_TO_VERSION',
          {
            infer: true,
          },
        ),
      },
    };
  }
}

export type ChangeLogOptions = {
  changeManagement: ChangeManagementOptions;
};

export type ChangeManagementOptions = {
  projectsPrefix: string[];
};
