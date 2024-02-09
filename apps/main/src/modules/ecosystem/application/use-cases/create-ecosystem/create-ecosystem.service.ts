import { Inject, Injectable } from '@nestjs/common';
import { CreateEcosystemCommand, ECOSYSTEM_REPOSITORY } from '@module-eco/application';
import { IApplicationServiceCommand } from '@lib-commons/application';
import { Ecosystem } from '@module-eco/domain';
import { IEcosystemRepository } from '@module-eco/domain/contracts/ecosystem-repository';
import { EcosystemNameAlreadyUsedException } from '@module-eco/domain/exceptions/ecosystem-name-already-used.exception';

@Injectable()
export class CreateEcosystemService implements IApplicationServiceCommand<CreateEcosystemCommand> {
  constructor(
    @Inject(ECOSYSTEM_REPOSITORY)
    private ecosystemRepository: IEcosystemRepository,
  ) {}

  async process<T extends CreateEcosystemCommand>(command: T): Promise<Ecosystem> {
    const { name, description, enabled } = command;

    const isNameAvailable = await this.ecosystemRepository.isNameAvailable(name);

    if (!isNameAvailable) {
      throw new EcosystemNameAlreadyUsedException();
    }

    const ecosystem = new Ecosystem();
    ecosystem.describe(name, description);

    if (enabled === false) {
      ecosystem.disable();
    }

    await this.ecosystemRepository.persist(ecosystem);

    return ecosystem;
  }
}
