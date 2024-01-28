import { Injectable } from '@nestjs/common';
import { RetrieveEcosystemService } from '@app-main/modules/ecosystem/application/use-cases/retrieve-ecosystem/retrieve-ecosystem.service';
import { RetrieveEcosystemQuery } from '@app-main/modules/ecosystem/application/use-cases/retrieve-ecosystem/retrieve-ecosystem.query';
import { Ecosystem } from '@app-main/modules/ecosystem/domain/ecosystem';

@Injectable()
export class EcosystemModuleFacade {
  constructor(private readonly retrieveEcosystemService: RetrieveEcosystemService) {}

  public async retrieveEcosystem(retrieveEcosystemQuery: RetrieveEcosystemQuery): Promise<Ecosystem> {
    return this.retrieveEcosystemService.process(retrieveEcosystemQuery);
  }
}
