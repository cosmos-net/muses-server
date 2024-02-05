//TODO: Refactor import
import { Ecosystem } from '@module-eco/domain/ecosystem';

export interface IEcosystemModuleFacade {
  getEcosystemById(id: string): Promise<Ecosystem>;
}
