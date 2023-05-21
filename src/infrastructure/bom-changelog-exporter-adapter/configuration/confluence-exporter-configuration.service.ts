import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfluenceExporterConfigurationService {
  constructor(
    private appConfigService: ConfigService<Record<string, unknown>, true>,
  ) {}

  getConfig(): ConfluenceExporterConfiguration {
    return {
      confluenceToken: this.appConfigService.get<string>('CONFLUENCE_TOKEN'),
      confluenceUser: this.appConfigService.get<string>('CONFLUENCE_USER'),
      confluenceUrl: this.appConfigService.get<string>('CONFLUENCE_URL'),
      pages: {
        systems: {
          spaceId: this.appConfigService.get<string>(
            'CONFLUENCE_SYSTEMS_SPACE_ID',
          ),
          spaceKey: this.appConfigService.get<string>(
            'CONFLUENCE_SYSTEMS_SPACE_KEY',
          ),
          pageId: this.appConfigService.get<string>(
            'CONFLUENCE_SYSTEMS_PAGE_ID',
          ),
        },
        boms: {
          spaceId: this.appConfigService.get<string>(
            'CONFLUENCE_BOMS_SPACE_ID',
          ),
          spaceKey: this.appConfigService.get<string>(
            'CONFLUENCE_BOMS_SPACE_KEY',
          ),
          pageId: this.appConfigService.get<string>('CONFLUENCE_BOMS_PAGE_ID'),
        },
      },
    };
  }
}

export type ConfluenceExporterConfiguration = {
  confluenceToken: string;
  confluenceUser: string;
  confluenceUrl: string;
  pages: {
    systems: {
      spaceId: string;
      spaceKey: string;
      pageId: string;
    };
    boms: {
      spaceId: string;
      spaceKey: string;
      pageId: string;
    };
  };
};
