import { MongoType } from '@lib-commons/domain/contracts/types/var-environment-map/db/mongo.type';
import { PostgresType } from '@lib-commons/domain/contracts/types/var-environment-map/db/postgres.type';

export type DatabaseType = {
  mongo: MongoType;
  postgres: PostgresType;
};
