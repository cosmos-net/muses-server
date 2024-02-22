import { IEcosystem } from '@module-project/domain/aggregate/value-objects/ecosystem.vo';

export interface IProjectSchema {
  id: string | any;
  name: string;
  description: string;
  ecosystem?: IEcosystem | any;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  modules?: string[] | any;
}
