export interface IUpdateSubModuleOutputDto {
  id: string;
  name: string;
  description: string;
  module: object | string;
  isEnabled: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt?: string | Date;
}

export class UpdateSubModuleOutputDto implements IUpdateSubModuleOutputDto {
  id: string;
  name: string;
  description: string;
  module: object | string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;

  constructor(root: IUpdateSubModuleOutputDto) {
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
