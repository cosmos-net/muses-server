//TODO: Refactor import
import { Ecosystem } from '@app-main/modules/ecosystem/domain/aggregate/ecosystem';

export interface IEcosystemModuleFacade {
  getEcosystemById(id: string): Promise<Ecosystem>;
}
