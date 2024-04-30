import { IProjectSchema } from '@module-project/domain/aggregate/project.schema';

export interface IModuleSchema {
  id: string | any;
  name: string;
  description: string;
  project: IProjectSchema | any;
  subModules: IModuleSchema[] | string[] | any;
  actions: string[] | any;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
