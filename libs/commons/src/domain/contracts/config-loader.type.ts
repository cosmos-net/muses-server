import { DatabaseConfigType } from '@management-commons/domain/contracts/database.type';
import { ServerConfigType } from '@management-commons/domain/contracts/server.type';

export type ConfigLoaderType = {
  readonly server: ServerConfigType;
  readonly database: DatabaseConfigType;
  readonly clientURL: string;
};
