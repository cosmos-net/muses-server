import { IModuleSchema } from '@module-module/domain/aggregate/module.schema';

export interface ISubModuleSchema {
  id: string | any;
  name: string;
  description: string;
  isEnabled: boolean;
  module: IModuleSchema | any;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
