import { MongoType } from '@management-commons/domain/contracts/types/var-environment-map/db/mongo.type';
import { PostgresType } from '@management-commons/domain/contracts/types/var-environment-map/db/postgres.type';

export type DatabaseType = {
  mongo: MongoType;
  postgres: PostgresType;
};
