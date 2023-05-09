import { plainToClass } from 'class-transformer';
import { IsNotEmpty, IsString, validateSync } from 'class-validator';

class GithubBomReaderEnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  GITHUB_TOKEN!: string;
}

export const validateGithubBomReaderEnvVars = (
  config: Record<string, unknown>,
) => {
  const finalConfig = plainToClass(
    GithubBomReaderEnvironmentVariables,
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
