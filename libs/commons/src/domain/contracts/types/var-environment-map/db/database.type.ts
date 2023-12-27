import { MongoType, PostgresType } from '@lib-commons/domain';

export type DatabaseType = {
  mongo: MongoType;
  postgres: PostgresType;
};
