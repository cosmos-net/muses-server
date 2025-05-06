import { Ecosystem } from '@context-ecosystem/domain/aggregate/ecosystem';

export interface IEcosystemModuleFacade {
  getEcosystemById(id: string): Promise<Ecosystem>;
}
