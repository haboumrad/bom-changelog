import { plainToClass } from 'class-transformer';
import { IsNotEmpty, IsString, validateSync } from 'class-validator';

class ConfluenceExporterEnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  CONFLUENCE_URL!: string;

  @IsString()
  @IsNotEmpty()
  CONFLUENCE_USER!: string;

  @IsString()
  @IsNotEmpty()
  CONFLUENCE_TOKEN!: string;

  @IsString()
  @IsNotEmpty()
  CONFLUENCE_SYSTEMS_SPACE_ID!: string;

  @IsString()
  @IsNotEmpty()
  CONFLUENCE_SYSTEMS_SPACE_KEY!: string;

  @IsString()
  @IsNotEmpty()
  CONFLUENCE_SYSTEMS_PAGE_ID!: string;

  @IsString()
  @IsNotEmpty()
  CONFLUENCE_BOMS_SPACE_ID!: string;

  @IsString()
  @IsNotEmpty()
  CONFLUENCE_BOMS_SPACE_KEY!: string;

  @IsString()
  @IsNotEmpty()
  CONFLUENCE_BOMS_PAGE_ID!: string;
}

export const validateConfluenceExporterEnvVars = (
  config: Record<string, unknown>,
) => {
  const finalConfig = plainToClass(
    ConfluenceExporterEnvironmentVariables,
    config,
    {
      enableImplicitConversion: true,
    },
  );

  const errors = validateSync(finalConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return finalConfig;
};
