import { plainToClass } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';

class CommandLineEnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  BOM_CONTEXT!: string;

  @IsString()
  @IsNotEmpty()
  CHANGE_PROJECT_PREFIX_FILTER!: string;

  @IsString()
  @IsOptional()
  CHANGE_PROJECT_SAFE_TO_DEPLOY_STATUS!: string;
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
