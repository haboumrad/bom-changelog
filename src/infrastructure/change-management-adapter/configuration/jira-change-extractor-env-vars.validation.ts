import { plainToClass } from 'class-transformer';
import { IsNotEmpty, IsString, validateSync } from 'class-validator';

class JiraChangeExtractorEnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  JIRA_URL!: string;

  @IsString()
  @IsNotEmpty()
  JIRA_USER!: string;

  @IsString()
  @IsNotEmpty()
  JIRA_TOKEN!: string;
}

export const validateJiraChangeExtractorEnvVars = (
  config: Record<string, unknown>,
) => {
  const finalConfig = plainToClass(
    JiraChangeExtractorEnvironmentVariables,
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
