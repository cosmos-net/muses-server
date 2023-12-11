import { DatabaseType } from '@management-commons/domain/contracts/types/var-environment-map/db/database.type';
import { ClientType } from '@management-commons/domain/contracts/types/var-environment-map/client/client.type';
import { JwtType } from '@management-commons/domain/contracts/types/var-environment-map/jwt/jwt.type';
import { ServersType } from '@management-commons/domain/contracts/types/var-environment-map/servers/servers.type';
import { UserRootType } from './user-root/user-root.type';

export type VarEnvMapConfigType = {
  readonly client: ClientType;
  readonly servers: ServersType;
  readonly databases: DatabaseType;
  readonly jwt: JwtType;
  readonly userRoot: UserRootType;
};
