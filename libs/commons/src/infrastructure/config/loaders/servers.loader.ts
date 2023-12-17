import { registerAs } from '@nestjs/config';
import { ConfigLoader } from '@lib-commons/infrastructure';
import { ServersType } from '@lib-commons/domain';

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
