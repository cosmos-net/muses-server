import { Inject, Injectable, Logger } from '@nestjs/common';
import { ECOSYSTEM_REPOSITORY, ListEcosystemQuery } from '@app-main/modules/ecosystem/application/';
import { IApplicationServiceQuery } from '@lib-commons/application';
import { ListEcosystem } from '@module-eco/domain';
import { IEcosystemRepository } from '@app-main/modules/ecosystem/domain/contracts/ecosystem-repository';

@Injectable()
export class ListEcosystemService implements IApplicationServiceQuery<ListEcosystemQuery> {
  private logger = new Logger(ListEcosystemService.name);

  constructor(
    @Inject(ECOSYSTEM_REPOSITORY)
    private ecosystemRepository: IEcosystemRepository,
  ) {}

  async process<T extends ListEcosystemQuery>(command: T): Promise<ListEcosystem> {
    const { filter, order, pagination } = command;

    const ecosystems = await this.ecosystemRepository.list({
      options: {
        filter,
        order,
        pagination,
      },
    });

    return ecosystems;
  }
}
