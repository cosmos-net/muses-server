import { IActionSchema } from '@module-action/domain/aggregate/action.schema';
import { EnumMethodValue } from '@module-resource/domain/aggregate/value-objects/method.vo';

export interface IResourceSchema {
  id: string | any;
  name: string;
  description: string;
  isEnabled: boolean;
  endpoint: string;
  method: EnumMethodValue;
  triggers?: IResourceSchema[] | string[] | null | any;
  actions: IActionSchema[] | string[] | any;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
