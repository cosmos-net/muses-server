import { EcosystemModuleFacade } from '@app-main/modules/ecosystem/infrastructure/api-facade/ecosystem-module.facade';
import { Ecosystem } from '@app-main/modules/ecosystem/domain/ecosystem';
import { IEcosystemModuleFacade } from '@app-main/modules/project/domain/contracts/ecosystem-module-facade';

export class EcosystemModuleFacadeService implements IEcosystemModuleFacade {
  constructor(private readonly ecosystemModuleFacade: EcosystemModuleFacade) {}

  async getEcosystemById(id: string): Promise<Ecosystem> {
    const ecosystem = await this.ecosystemModuleFacade.retrieveEcosystem({
      id,
    });

    return ecosystem;
  }
}
