import { Injectable } from '@nestjs/common';
import { RetrieveEcosystemService } from '@module-eco/application/use-cases/retrieve-ecosystem/retrieve-ecosystem.service';
import { RetrieveEcosystemQuery } from '@module-eco/application/use-cases/retrieve-ecosystem/retrieve-ecosystem.query';
import { Ecosystem } from '@module-eco/domain/ecosystem';

@Injectable()
export class EcosystemModuleFacade {
  constructor(private readonly retrieveEcosystemService: RetrieveEcosystemService) {}

  public async retrieveEcosystem(retrieveEcosystemQuery: RetrieveEcosystemQuery): Promise<Ecosystem> {
    return this.retrieveEcosystemService.process(retrieveEcosystemQuery);
  }
}
