import { ServerAuthType } from '@management-commons/domain/contracts/types/var-environment-map/servers/server-auth.type';
import { ServerMainType } from '@management-commons/domain/contracts/types/var-environment-map/servers/server-main.type';

export type ServersType = {
  main: ServerMainType;
  auth: ServerAuthType;
};
