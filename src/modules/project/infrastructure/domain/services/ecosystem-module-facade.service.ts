import { IEcosystemModuleFacade } from '@module-project/domain/contracts/ecosystem-module-facade';
import { EcosystemModuleFacade } from '@module-eco/infrastructure/api-facade/ecosystem-module.facade';
import { Injectable } from '@nestjs/common';
import { Ecosystem } from '@module-eco/domain/aggregate/ecosystem';

@Injectable()
export class EcosystemModuleFacadeService implements IEcosystemModuleFacade {
  constructor(private readonly ecosystemModuleFacade: EcosystemModuleFacade) {}

  async getEcosystemById(id: string): Promise<Ecosystem> {
    const ecosystem = await this.ecosystemModuleFacade.retrieveEcosystem({
      id,
      withDisabled: true,
    });

    return ecosystem;
  }
}
