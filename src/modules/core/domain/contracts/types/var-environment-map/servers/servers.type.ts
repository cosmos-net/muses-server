import { ServerAuthType } from '@core/domain/contracts/types/var-environment-map/servers/server-auth.type';
import { ServerMainType } from '@core/domain/contracts/types/var-environment-map/servers/server-main.type';

export type ServersType = {
  main: ServerMainType;
  auth: ServerAuthType;
};
