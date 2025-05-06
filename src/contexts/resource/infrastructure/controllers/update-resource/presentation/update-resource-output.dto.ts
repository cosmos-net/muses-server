import { IResourceSchema } from '@module-resource/domain/aggregate/resource.schema';
import { IActionSchema } from '@module-action/domain/aggregate/action.schema';

export interface IUpdateResourceOutputDto {
  id: string | any;
  name: string;
  description: string;
  isEnabled: boolean;
  endpoint: string;
  method: string;
  triggers?: IResourceSchema[] | string[] | null | any;
  actions: IActionSchema[] | string[] | any;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt?: string | Date;
}

export class UpdateResourceOutputDto implements IUpdateResourceOutputDto {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  endpoint: string;
  method: string;
  triggers?: IResourceSchema[] | string[] | null | any;
  actions: IActionSchema[] | string[] | any;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;

  constructor(root: IUpdateResourceOutputDto) {
    this.id = root.id;
    this.name = root.name;
    this.description = root.description;
    this.isEnabled = root.isEnabled;
    this.endpoint = root.endpoint;
    this.method = root.method;
    this.triggers = root.triggers;
    this.actions = root.actions;
    this.createdAt = root.createdAt instanceof Date ? root.createdAt.toISOString() : root.createdAt;
    this.updatedAt = root.updatedAt instanceof Date ? root.updatedAt.toISOString() : root.updatedAt;
    this.deletedAt = root.deletedAt instanceof Date ? root.deletedAt.toISOString() : root.deletedAt;
  }
}
