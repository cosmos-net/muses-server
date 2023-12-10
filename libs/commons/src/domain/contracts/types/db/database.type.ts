import { MongoType } from '@management-commons/domain/contracts/types/db/mongo.type'
import { PostgresType } from '@management-commons/domain/contracts/types/db/postgres.type'

export type DatabaseType = {
  mongo: MongoType;
  postgres: PostgresType;
};
