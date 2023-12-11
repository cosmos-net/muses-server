import { registerAs } from '@nestjs/config';
import { ConfigLoader } from '@management-commons/infrastructure/config/loaders/config.loader';
import { ServersType } from '@management-commons/domain/contracts/types/var-environment-map/servers/servers.type';

export const ServersLoader = {
  main: registerAs(
    'main',
    (): ServersType['main'] => ConfigLoader().servers.main,
  ),
  auth: registerAs(
    'auth',
    (): ServersType['auth'] => ConfigLoader().servers.auth,
  ),
};
