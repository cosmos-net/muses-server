import { IActionSchema } from '@module-action/domain/aggregate/action.schema';

export interface IResourceSchema {
  id: string | any;
  name: string;
  description: string;
  isEnabled: boolean;
  endpoint: string;
  method: string;
  triggers?: IResourceSchema[] | string[] | null | any;
  actions: IActionSchema[] | string[] | any;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
