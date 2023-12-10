
import { registerAs } from '@nestjs/config';
import { ConfigLoader } from '@management-commons/infrastructure/config/loaders/config.loader';
import { ServerType } from '@management-commons/domain/contracts/types/server/server.type';

export const ServerLoader = registerAs(
  'server',
  (): ServerType => ConfigLoader().server,
);
