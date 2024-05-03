import { IApplicationServiceQuery } from '@lib-commons/application/application-service-query';
import { RetrieveEcosystemQuery } from '@module-eco/application/use-cases/retrieve-ecosystem/retrieve-ecosystem.query';
import { Inject } from '@nestjs/common';
import { ECOSYSTEM_REPOSITORY } from '@module-eco/application/constants/injection-token';
import { Ecosystem } from '@module-eco/domain/aggregate/ecosystem';
import { IEcosystemRepository } from '@module-eco/domain/contracts/ecosystem-repository';

export class RetrieveEcosystemService implements IApplicationServiceQuery<RetrieveEcosystemQuery> {
  constructor(
    @Inject(ECOSYSTEM_REPOSITORY)
    private readonly ecosystemRepository: IEcosystemRepository,
  ) {}

  async process<T extends RetrieveEcosystemQuery>(query: T): Promise<Ecosystem> {
    const { id, withDisabled: withDeleted } = query;

    const ecosystem = await this.ecosystemRepository.byIdOrFail(id, withDeleted);

    return ecosystem;
  }
}
