import { EnvironmentEnum } from '@management-commons/domain/contracts/enums/environment.enum';

export type ServerMainType = {
  name: string;
  host: string;
  port: number;
  env: EnvironmentEnum;
};
