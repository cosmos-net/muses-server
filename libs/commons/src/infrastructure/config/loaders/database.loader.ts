import { registerAs } from '@nestjs/config';
import { ConfigLoader } from '@management-commons/infrastructure/config/loaders/config.loader';
import { DatabaseType } from '@management-commons/domain/contracts/types/var-environment-map/db/database.type';

export const DatabasesLoader = {
  mongo: registerAs(
    'mongo',
    (): DatabaseType['mongo'] => ConfigLoader().databases.mongo,
  ),
  postgres: registerAs(
    'postgres',
    (): DatabaseType['postgres'] => ConfigLoader().databases.postgres,
  ),
};
