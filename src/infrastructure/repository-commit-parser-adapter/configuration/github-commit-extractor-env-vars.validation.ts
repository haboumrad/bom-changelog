import { plainToClass } from 'class-transformer';
import { IsNotEmpty, IsString, validateSync } from 'class-validator';

class GithubCommitExtractorEnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  GITHUB_TOKEN!: string;
}

export const validateGithubCommitExtractorEnvVars = (
  config: Record<string, unknown>,
) => {
  const finalConfig = plainToClass(
    GithubCommitExtractorEnvironmentVariables,
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
