export interface IUpdateModuleOutputDto {
  id: string;
  name: string;
  description: string;
  project:
    | string
    | {
        id: string;
        name: string;
        description: string;
        isEnabled: boolean;
        createdAt: string | Date;
        updatedAt: string | Date;
        deletedAt?: string | Date;
      };
  isEnabled: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt?: string | Date;
}

export class UpdateModuleOutputDto implements IUpdateModuleOutputDto {
  id: string;
  name: string;
  description: string;
  project:
    | string
    | {
        id: string;
        name: string;
        description: string;
        isEnabled: boolean;
        createdAt: string | Date;
        updatedAt: string | Date;
        deletedAt?: string | Date;
      };
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;

  constructor(root: IUpdateModuleOutputDto) {
    this.id = root.id;
    this.name = root.name;
    this.description = root.description;
    this.project = root.project;
    this.isEnabled = root.isEnabled;
    this.createdAt = root.createdAt instanceof Date ? root.createdAt.toISOString() : root.createdAt;
    this.updatedAt = root.updatedAt instanceof Date ? root.updatedAt.toISOString() : root.updatedAt;
    this.deletedAt = root.deletedAt instanceof Date ? root.deletedAt.toISOString() : root.deletedAt;
  }
}
