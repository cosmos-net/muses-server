import { IEcosystemModuleFacade } from '@module-project/domain/contracts/ecosystem-module-facade';
import { EcosystemModuleFacade } from '@module-eco/infrastructure/api-facade/ecosystem-module.facade';
import { IEcosystemSchema } from '@module-eco/domain/aggregate/ecosystem.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EcosystemModuleFacadeService implements IEcosystemModuleFacade {
  constructor(private readonly ecosystemModuleFacade: EcosystemModuleFacade) {}

  async getEcosystemById(id: string): Promise<IEcosystemSchema> {
    const ecosystem = await this.ecosystemModuleFacade.retrieveEcosystem({
      id,
    });

    return ecosystem.toPrimitives();
  }
}
