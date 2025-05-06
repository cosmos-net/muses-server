import { IModuleSchema } from '@module-module/domain/aggregate/module.schema';
import { ISubModuleSchema } from '@module-sub-module/domain/aggregate/sub-module.schema';

export interface IGetActionOutputDto {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  module: IModuleSchema | string | any;
  submodule: ISubModuleSchema | string | any;
  actionCatalog: any;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt?: string | Date;
}

export class GetActionOutputDto implements IGetActionOutputDto {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  module: IModuleSchema | string | any;
  submodule: ISubModuleSchema | string | any;
  actionCatalog: any;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;

  constructor(root: IGetActionOutputDto) {
    this.id = root.id;
    this.name = root.name;
    this.description = root.description;
    this.isEnabled = root.isEnabled;
    this.module = root.module;
    this.submodule = root.submodule;
    this.actionCatalog = root.actionCatalog;
    this.createdAt = root.createdAt instanceof Date ? root.createdAt.toISOString() : root.createdAt;
    this.updatedAt = root.updatedAt instanceof Date ? root.updatedAt.toISOString() : root.updatedAt;
    this.deletedAt = root.deletedAt instanceof Date ? root.deletedAt.toISOString() : root.deletedAt;
  }
}
