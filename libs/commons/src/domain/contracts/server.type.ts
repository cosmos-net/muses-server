import { EnvironmentEnum } from '@management-commons/domain/contracts/environment.enum';

export type ServerConfigType = {
  applicationName: string;
  host?: string;
  port?: number;
  env: EnvironmentEnum;
};
