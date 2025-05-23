export interface IGetModuleOutputDto {
  id: string;
  name: string;
  description: string;
  project: object | string;
  isEnabled: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt?: string | Date;
}

export class GetModuleOutputDto implements IGetModuleOutputDto {
  id: string;
  name: string;
  description: string;
  project: object | string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  disabledAt: string;
  deletedAt?: string;

  constructor(root: IGetModuleOutputDto) {
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
