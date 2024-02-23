/* eslint-disable hexagonal-architecture/enforce */
import { ConfigModuleOptions } from '@nestjs/config';
import { mongo_test_loader } from './mongo-test.loader';
import { MongoTestConfigSchema } from './mongo-test-config-schema';

export const MongoTestConfigOptions: ConfigModuleOptions = {
  cache: true,
  isGlobal: true,
  load: [mongo_test_loader],
  validationSchema: MongoTestConfigSchema,
  validationOptions: {
    allowUnknown: true,
    abortEarly: true,
  },
  envFilePath: ['.test-local.env'],
};
