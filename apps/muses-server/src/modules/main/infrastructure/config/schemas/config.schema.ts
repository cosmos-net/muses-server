import { EnvironmentEnum } from '@management-commons/domain/contracts/environment.enum';
import * as Joi from 'joi';

export const ConfigSchema = Joi.object({
  APP_NAME: Joi.string().empty('').default('Application'),
  HOST: Joi.string().empty('').default('localhost'),
  NODE_ENV: Joi.string()
    .valid(...Object.values(EnvironmentEnum))
    .default(EnvironmentEnum.LOCAL),
  PORT: Joi.number().required(),
  DATABASE_TYPE: Joi.string().required(),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().allow(''),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_SSL: Joi.string().default('false'),
  DATABASE_RUN_MIGRATIONS: Joi.string(),
  DATABASE_SYNC: Joi.string(),
});
