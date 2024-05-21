import { ClientType } from '@core/domain/contracts/types/var-environment-map/client/client.type';
import { DatabaseType } from '@core/domain/contracts/types/var-environment-map/db/database.type';
import { JwtType } from '@core/domain/contracts/types/var-environment-map/jwt/jwt.type';
import { ServersType } from '@core/domain/contracts/types/var-environment-map/servers/servers.type';
import { UserRootType } from '@core/domain/contracts/types/var-environment-map/user-root/user-root.type';

export type VarEnvMapConfigType = {
  readonly client: ClientType;
  readonly servers: ServersType & { serverEnv: string };
  readonly databases: DatabaseType;
  readonly jwt: JwtType;
  readonly userRoot: UserRootType;
};
