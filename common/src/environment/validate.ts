import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ClassConstructor } from 'class-transformer/types/interfaces';

function validate<T extends object>(
  EnvironmentVariables: ClassConstructor<T>,
  config: Record<string, unknown>,
): T {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}

export const makeValidatorForClass = <T extends object>(
  ClassValidator: ClassConstructor<T>,
): ((config: Record<string, unknown>) => object) => {
  return validate.bind(this, ClassValidator);
};
