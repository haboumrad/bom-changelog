import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CommandLineConfigurationService {
  constructor(
    private appConfigService: ConfigService<Record<string, unknown>, true>,
  ) {}

  getChangeLogOptions(): ChangeLogOptions {
    const changeprojectsafetodeploystatus = this.appConfigService.get<string>(
      'CHANGE_PROJECT_SAFE_TO_DEPLOY_STATUS',
    );
    return {
      changeManagement: {
        projectsPrefix: this.appConfigService
          .get<string>('CHANGE_PROJECT_PREFIX_FILTER')
          .split(','),
        safeToDeployStatus: changeprojectsafetodeploystatus
          ? changeprojectsafetodeploystatus.split(',')
          : undefined,
      },
    };
  }
}

export type ChangeLogOptions = {
  changeManagement: ChangeManagementOptions;
};

export type ChangeManagementOptions = {
  projectsPrefix: string[];
  safeToDeployStatus: string[];
};
