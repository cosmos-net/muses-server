// eslint-disable-next-line hexagonal-architecture/enforce
import { registerAs } from '@nestjs/config';
import { MongoTestType } from './mongo-test.type';
import { MongoTestConfigLoader } from './mongo-config.loader';

export const mongo_test_loader = registerAs('mongo_test', (): MongoTestType => MongoTestConfigLoader().mongo_test);
