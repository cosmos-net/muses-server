import { IModuleSchema } from '@module-module/domain/aggregate/module.schema';

export interface IGetSubModuleOutputDto {
  id: string;
  name: string;
  description: string;
  module: Partial<IModuleSchema>;
  isEnabled: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt?: string | Date;
}

export class GetSubModuleOutputDto implements IGetSubModuleOutputDto {
  id: string;
  name: string;
  description: string;
  module: Partial<IModuleSchema>;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  disabledAt: string;
  deletedAt?: string;

  constructor(root: IGetSubModuleOutputDto) {
    this.id = root.id;
    this.name = root.name;
    this.description = root.description;
    this.module = root.module;
    this.isEnabled = root.isEnabled;
    this.createdAt = root.createdAt instanceof Date ? root.createdAt.toISOString() : root.createdAt;
    this.updatedAt = root.updatedAt instanceof Date ? root.updatedAt.toISOString() : root.updatedAt;
    this.deletedAt = root.deletedAt instanceof Date ? root.deletedAt.toISOString() : root.deletedAt;
  }
}
