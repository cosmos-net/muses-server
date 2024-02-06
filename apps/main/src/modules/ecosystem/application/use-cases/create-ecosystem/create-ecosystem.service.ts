import { Inject, Injectable } from '@nestjs/common';
import { CreateEcosystemCommand, ECOSYSTEM_REPOSITORY } from '@module-eco/application';
import { IApplicationServiceCommand } from '@lib-commons/application';
import { Ecosystem } from '@module-eco/domain';
import { IEcosystemRepository } from '@app-main/modules/ecosystem/domain/contracts/ecosystem-repository';

@Injectable()
export class CreateEcosystemService implements IApplicationServiceCommand<CreateEcosystemCommand> {
  constructor(
    @Inject(ECOSYSTEM_REPOSITORY)
    private ecosystemRepository: IEcosystemRepository,
  ) {}

  async process<T extends CreateEcosystemCommand>(command: T): Promise<Ecosystem> {
    const { name, description, enabled } = command;

    const ecosystem = new Ecosystem();
    ecosystem.describe(name, description);

    if (!enabled) {
      ecosystem.disabled();
    }

    await this.ecosystemRepository.persist(ecosystem);

    return ecosystem;
  }
}
