import { registerAs } from '@nestjs/config';
import { ConfigLoader } from '@lib-commons/infrastructure';
import { DatabaseType } from '@lib-commons/domain';

export const DatabasesLoader = {
  mongo: registerAs('mongo', (): DatabaseType['mongo'] => ConfigLoader().databases.mongo),
  postgres: registerAs('postgres', (): DatabaseType['postgres'] => ConfigLoader().databases.postgres),
};
