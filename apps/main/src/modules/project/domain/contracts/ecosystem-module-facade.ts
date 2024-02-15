import { Ecosystem } from '@module-eco/domain/aggregate/ecosystem';

export interface IEcosystemModuleFacade {
  getEcosystemById(id: string): Promise<Ecosystem>;
}
