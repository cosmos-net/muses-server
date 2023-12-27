import { EnvironmentEnum } from '@lib-commons/domain';

export type ServerAuthType = {
  name: string;
  host: string;
  port: number;
  env: EnvironmentEnum;
  hashSalt: number;
};
