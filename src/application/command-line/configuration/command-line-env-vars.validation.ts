import { plainToClass } from 'class-transformer';
import { IsNotEmpty, IsString, validateSync } from 'class-validator';

class CommandLineEnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  BOM_REPOSITORY_LABEL!: string;

  @IsString()
  @IsNotEmpty()
  BOM_REPOSITORY_NAME!: string;

  @IsString()
  @IsNotEmpty()
  BOM_REPOSITORY_FROM_VERSION!: string;

  @IsString()
  @IsNotEmpty()
  BOM_REPOSITORY_TO_VERSION!: string;
}

export const validateCommandLineEnvVars = (config: Record<string, unknown>) => {
  const finalConfig = plainToClass(CommandLineEnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(finalConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return finalConfig;
};
