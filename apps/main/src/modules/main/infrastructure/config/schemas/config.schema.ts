import { EnvironmentEnum } from '@management-commons/domain/contracts/enums/environment.enum';
import * as Joi from 'joi';

export const ConfigSchema = Joi.object({
  CLIENT_HOST: Joi.string().required(),
  CLIENT_PORT: Joi.number().required(),
  CLIENT_PROTOCOL: Joi.string().required(),
  SERVER_HOST: Joi.string().required(),
  SERVER_PORT: Joi.number().required(),
  SERVER_NAME: Joi.string().required(),
  SERVER_ENV: Joi.string().valid(...Object.values(EnvironmentEnum)),
  DB_MONGO_HOST: Joi.string().required(),
  DB_MONGO_PORT: Joi.number().required(),
  DB_MONGO_TYPE: Joi.string().required(),
  DB_MONGO_USER: Joi.string().required(),
  DB_MONGO_PASS: Joi.string().required(),
  DB_MONGO_NAME: Joi.string().required(),
  DB_POSTGRES_HOST: Joi.string().required(),
  DB_POSTGRES_PORT: Joi.number().required(),
  DB_POSTGRES_TYPE: Joi.string().required(),
  DB_POSTGRES_USER: Joi.string().required(),
  DB_POSTGRES_PASS: Joi.string().required(),
  DB_POSTGRES_NAME: Joi.string().required(),
  DB_POSTGRES_SSL: Joi.boolean().required(),
  DB_POSTGRES_SYNC: Joi.boolean().required(),
  DB_POSTGRES_AUTO_LOAD: Joi.boolean().required(),
  DB_POSTGRES_RUN_MIGRATIONS: Joi.boolean().required(),
  DB_POSTGRES_LOGGING: Joi.boolean().required(),
  DB_POSTGRES_MIGRATIONS_TABLE_NAME: Joi.string().required(),
});
