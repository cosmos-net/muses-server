import { EnvironmentEnum } from '@management-commons/domain/contracts/enums/environment.enum';

export type ServerAuthType = {
  name: string;
  host: string;
  port: number;
  env: EnvironmentEnum;
  hashSalt: number;
};
