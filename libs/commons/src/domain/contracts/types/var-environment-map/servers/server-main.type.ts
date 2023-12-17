import { EnvironmentEnum } from "@lib-commons/domain";

export type ServerMainType = {
  name: string;
  host: string;
  port: number;
  env: EnvironmentEnum;
};
