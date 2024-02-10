import { IEcosystemSchema } from '@module-eco/domain/aggregate/ecosystem.schema';

export interface IEcosystemModuleFacade {
  getEcosystemById(id: string): Promise<IEcosystemSchema>;
}
