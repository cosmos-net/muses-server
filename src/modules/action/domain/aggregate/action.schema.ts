import { ISubModuleSchema } from '@module-sub-module/domain/aggregate/sub-module.schema';
import { IModuleSchema } from '@module-module/domain/aggregate/module.schema';

export interface IActionSchema {
  id: string | any;
  name: string;
  description: string;
  isEnabled: boolean;
  modules: IModuleSchema | string[] | any;
  subModules: ISubModuleSchema | string[] | any;
  resource: string | any;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
