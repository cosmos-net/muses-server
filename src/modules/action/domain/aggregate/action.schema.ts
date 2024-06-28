import { ISubModuleSchema } from '@module-sub-module/domain/aggregate/sub-module.schema';
import { IModuleSchema } from '@module-module/domain/aggregate/module.schema';
import { IActionCatalogSchema } from './action-catalog';

export interface IActionSchema {
  id: string | any;
  name: string;
  description: string;
  isEnabled: boolean;
  modules: IModuleSchema | string[] | any;
  subModules: ISubModuleSchema | string[] | any;
  actionCatalog: IActionCatalogSchema | string | any;
  resource: string | any;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
