import { DatabaseType } from '@management-commons/domain/contracts/types/db/database.type';
import { ServerType } from '@management-commons/domain/contracts/types/server/server.type';
import { ClientType } from '@management-commons/domain/contracts/types/client/client.type';

export type ConfigLoaderType = {
  readonly client: ClientType;
  readonly server: ServerType;
  readonly databases: DatabaseType;
};
