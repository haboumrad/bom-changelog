import { Command, CommandRunner, Option } from 'nest-commander';

import { AppEntrypointService } from '../../domain/app-entrypoint/app-entrypoint.service';
import { CommandLineConfigurationService } from './configuration/command-line-configuration.service';
import { BOMChangeLogRequest } from '../../domain/bom-changelog-generator/model/bom-changelog';

interface CommandLineOptions {
  repoName: string;
  repoLabel: string;
  from: string;
  to: string;
}

@Command({
  name: 'changelog',
  description: 'Generate changelog',
  options: { isDefault: false },
})
export class CommandLineService extends CommandRunner {
  constructor(
    private readonly configuration: CommandLineConfigurationService,
    private readonly appEntrypointService: AppEntrypointService,
  ) {
    super();
  }

  @Option({
    flags: '-l, --repo-label <repoLabel>',
    description: 'the label used to generate the bom page name',
  })
  parseRepoLabel(val: string): string {
    return val;
  }

  @Option({
    flags: '-r, --repo-name <repoName>',
    description: 'the bom repository name',
  })
  parseRepoName(val: string): string {
    return val;
  }

  @Option({
    flags: '-f, --from <from>',
    description: 'the from version of the bom repository',
  })
  parseFrom(val: string): string {
    return val;
  }

  @Option({
    flags: '-t, --to <to>',
    description: 'the to version of the bom repository',
  })
  parseTo(val: string): string {
    return val;
  }

  async run(
    passedParam: string[],
    options?: CommandLineOptions,
  ): Promise<void> {
    console.log(`options: ${JSON.stringify(options)}`);
    const changeLogRequest = {
      bomRepository: {
        label: options.repoLabel,
        name: options.repoName,
      },
      from: {
        selector: options.from,
      },
      to: {
        selector: options.to,
      },
    } as BOMChangeLogRequest;

    return this.appEntrypointService.exportChangeLog(
      changeLogRequest,
      this.configuration.getChangeLogOptions(),
    );
  }
}
