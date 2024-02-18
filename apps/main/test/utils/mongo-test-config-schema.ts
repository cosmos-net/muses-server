/* eslint-disable hexagonal-architecture/enforce */
import * as Joi from 'joi';

export const MongoTestConfigSchema = Joi.object({
  DB_MONGO_HOST: Joi.string().required(),
  DB_MONGO_PORT: Joi.number().required(),
  DB_MONGO_TYPE: Joi.string().required(),
  DB_MONGO_USER: Joi.string().required(),
  DB_MONGO_PASS: Joi.string().required(),
  DB_MONGO_NAME: Joi.string().required(),
  DB_MONGO_SSL: Joi.boolean().required(),
  DB_MONGO_SYNC: Joi.boolean().required(),
  DB_MONGO_AUTO_LOAD: Joi.boolean().required(),
  DB_MONGO_RUN_MIGRATIONS: Joi.boolean().required(),
  DB_MONGO_LOGGING: Joi.boolean().required(),
  DB_MONGO_MIGRATIONS_TABLE_NAME: Joi.string().required(),
});
