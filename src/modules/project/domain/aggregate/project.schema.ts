import { IEcosystemSchema } from '@module-eco/domain/aggregate/ecosystem.schema';

export interface IProjectSchema {
  id: string | any;
  name: string;
  description: string;
  ecosystem?: IEcosystemSchema | any;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  modules?: string[] | any;
}
