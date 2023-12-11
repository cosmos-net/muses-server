import { EnvironmentEnum } from '@management-commons/domain/contracts/enums/environment.enum';
import * as Joi from 'joi';

export const ConfigSchema = Joi.object({
  CLIENT_HOST: Joi.string().required(),
  CLIENT_PORT: Joi.number().required(),
  CLIENT_PROTOCOL: Joi.string().required(),
  SERVER_MAIN_HOST: Joi.string().required(),
  SERVER_MAIN_PORT: Joi.number().required(),
  SERVER_MAIN_NAME: Joi.string().required(),
  SERVER_MAIN_ENV: Joi.string().valid(...Object.values(EnvironmentEnum)),
  SERVER_AUTH_HOST: Joi.string().required(),
  SERVER_AUTH_PORT: Joi.number().required(),
  SERVER_AUTH_NAME: Joi.string().required(),
  SERVER_AUTH_ENV: Joi.string().valid(...Object.values(EnvironmentEnum)),
  CRYPT_SALT_ROUNDS: Joi.number().required(),
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
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),
  USER_ROOT_USERNAME: Joi.string().required(),
  USER_ROOT_EMAIL: Joi.string().required(),
  USER_ROOT_PASSWORD: Joi.string().required(),
});
