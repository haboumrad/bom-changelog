import * as YAML from 'yaml';
import { BomParserService } from '../src/domain/bom-diff/service/bom-parser.service';
import { BomReader } from '../src/domain/bom-diff/port/bom-reader';

describe('BomParserService', () => {
  const mockBomReader: BomReader = {
    readFile: jest.fn(),
    resolveBomUrl: jest.fn().mockReturnValue('https://github.com/org/repo'),
    resolveBomDiffUrl: jest.fn(),
  };

  const service = new BomParserService(mockBomReader);

  const bomVersion = {
    repository: { label: 'bom-sample', name: 'org/bom-sample' },
    version: { selector: '1.0.0' },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should use version as selector when no tagPattern is defined', async () => {
    const bomYaml = YAML.stringify({
      systems: [
        { name: 'sample-sys-1', version: '0.0.4', url: 'org/sample-sys-1' },
      ],
    });
    (mockBomReader.readFile as jest.Mock).mockResolvedValue(bomYaml);

    const result = await service.readBom(bomVersion);

    expect(result.systems).toHaveLength(1);
    expect(result.systems[0].version.selector).toBe('0.0.4');
    expect(result.systems[0].repository.name).toBe('org/sample-sys-1');
    expect(result.systems[0].repository.label).toBe('sample-sys-1');
  });

  it('should resolve tagPattern replacing {version} with actual version', async () => {
    const bomYaml = YAML.stringify({
      systems: [
        {
          name: 'project1',
          version: '1.0.0',
          url: 'org/mono-repo',
          tagPattern: 'project1:v{version}',
        },
      ],
    });
    (mockBomReader.readFile as jest.Mock).mockResolvedValue(bomYaml);

    const result = await service.readBom(bomVersion);

    expect(result.systems[0].version.selector).toBe('project1:v1.0.0');
  });

  it('should handle multiple projects in the same repo with different tagPatterns', async () => {
    const bomYaml = YAML.stringify({
      systems: [
        {
          name: 'project1',
          version: '1.2.3',
          url: 'org/mono-repo',
          tagPattern: 'project1:v{version}',
        },
        {
          name: 'project2',
          version: '4.5.6',
          url: 'org/mono-repo',
          tagPattern: 'project2/v{version}',
        },
      ],
    });
    (mockBomReader.readFile as jest.Mock).mockResolvedValue(bomYaml);

    const result = await service.readBom(bomVersion);

    expect(result.systems).toHaveLength(2);
    expect(result.systems[0].version.selector).toBe('project1:v1.2.3');
    expect(result.systems[1].version.selector).toBe('project2/v4.5.6');
  });

  it('should support mixed systems with and without tagPattern', async () => {
    const bomYaml = YAML.stringify({
      systems: [
        {
          name: 'standalone-service',
          version: '2.0.0',
          url: 'org/standalone-service',
        },
        {
          name: 'project1',
          version: '1.0.0',
          url: 'org/mono-repo',
          tagPattern: 'project1:v{version}',
        },
      ],
    });
    (mockBomReader.readFile as jest.Mock).mockResolvedValue(bomYaml);

    const result = await service.readBom(bomVersion);

    expect(result.systems[0].version.selector).toBe('2.0.0');
    expect(result.systems[1].version.selector).toBe('project1:v1.0.0');
  });
});
