import { DatabaseType, ClientType, JwtType, ServersType, UserRootType } from '@lib-commons/domain';

export type VarEnvMapConfigType = {
  readonly client: ClientType;
  readonly servers: ServersType;
  readonly databases: DatabaseType;
  readonly jwt: JwtType;
  readonly userRoot: UserRootType;
};
