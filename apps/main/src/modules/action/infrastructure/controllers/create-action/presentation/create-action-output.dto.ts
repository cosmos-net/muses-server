import { IModuleSchema } from '@module-module/domain/aggregate/module.schema';
import { ISubModuleSchema } from '@module-sub-module/domain/aggregate/sub-module.schema';
export interface ICreateActionOutputDto {
  id: string;
  name: string;
  description: string;
  modules: IModuleSchema[] | string[] | any;
  subModules: ISubModuleSchema[] | string[] | any;
  isEnabled: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt?: string | Date;
}

export class CreateActionOutputDto implements ICreateActionOutputDto {
  id: string;
  name: string;
  description: string;
  modules: IModuleSchema[] | string[] | any;
  subModules: ISubModuleSchema[] | string[] | any;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;

  constructor(root: ICreateActionOutputDto) {
    this.id = root.id;
    this.name = root.name;
    this.description = root.description;
    this.modules = root.modules;
    this.subModules = root.subModules;
    this.isEnabled = root.isEnabled;
    this.createdAt = root.createdAt instanceof Date ? root.createdAt.toISOString() : root.createdAt;
    this.updatedAt = root.updatedAt instanceof Date ? root.updatedAt.toISOString() : root.updatedAt;
    this.deletedAt = root.deletedAt instanceof Date ? root.deletedAt.toISOString() : root.deletedAt;
  }
}
