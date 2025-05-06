import { Injectable } from '@nestjs/common';
import { RetrieveEcosystemService } from '@context-ecosystem/application/use-cases/retrieve-ecosystem/retrieve-ecosystem.service';
import { RetrieveEcosystemQuery } from '@context-ecosystem/application/use-cases/retrieve-ecosystem/retrieve-ecosystem.query';
import { Ecosystem } from '@context-ecosystem/domain/aggregate/ecosystem';

@Injectable()
export class EcosystemModuleFacade {
  constructor(private readonly retrieveEcosystemService: RetrieveEcosystemService) {}

  public async retrieveEcosystem(retrieveEcosystemQuery: RetrieveEcosystemQuery): Promise<Ecosystem> {
    return this.retrieveEcosystemService.process(retrieveEcosystemQuery);
  }
}
