import { MongoType } from '@core/domain/contracts/types/var-environment-map/db/mongo.type';
import { PostgresType } from '@core/domain/contracts/types/var-environment-map/db/postgres.type';

export type DatabaseType = {
  mongo: MongoType;
  postgres: PostgresType;
};
