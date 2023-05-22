import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CommandLineConfigurationService {
  constructor(
    private appConfigService: ConfigService<Record<string, unknown>, true>,
  ) {}

  getChangeLogOptions(): ChangeLogOptions {
    return {
      changeManagement: {
        projectsPrefix: this.appConfigService
          .get<string>('CHANGE_PROJECT_PREFIX_FILTER')
          .split(','),
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
