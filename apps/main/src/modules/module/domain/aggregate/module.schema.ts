import { IProject } from '@module-module/domain/aggregate/value-objects/project.vo';

export interface IModuleSchema {
  id: string | any;
  name: string;
  description: string;
  project: IProject | any;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
