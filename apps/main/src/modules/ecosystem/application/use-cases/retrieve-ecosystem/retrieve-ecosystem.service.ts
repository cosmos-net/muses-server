import { IApplicationServiceQuery } from '@lib-commons/application';
import { RetrieveEcosystemQuery } from '@module-eco/application/use-cases/retrieve-ecosystem/retrieve-ecosystem.query';
import { Inject } from '@nestjs/common';
import { ECOSYSTEM_REPOSITORY } from '@module-eco/application/constants/injection-token';
import { Ecosystem } from '@app-main/modules/ecosystem/domain';
import { IEcosystemRepository } from '@app-main/modules/ecosystem/domain/contracts/ecosystem-repository';

export class RetrieveEcosystemService implements IApplicationServiceQuery<RetrieveEcosystemQuery> {
  constructor(
    @Inject(ECOSYSTEM_REPOSITORY)
    private readonly ecosystemRepository: IEcosystemRepository,
  ) {}

  async process<T extends RetrieveEcosystemQuery>(query: T): Promise<Ecosystem> {
    const { id } = query;

    const ecosystem = await this.ecosystemRepository.byIdOrFail(id);

    return ecosystem;
  }
}
