import { Inject, Injectable } from '@nestjs/common';
import { ECOSYSTEM_REPOSITORY } from '@module-eco/application/constants/injection-token';
import { IApplicationServiceCommand } from '@lib-commons/application/application-service-command';
import { Ecosystem } from '@module-eco/domain/aggregate/ecosystem';
import { IEcosystemRepository } from '@module-eco/domain/contracts/ecosystem-repository';
import { EcosystemNameAlreadyUsedException } from '@module-eco/domain/exceptions/ecosystem-name-already-used.exception';
import { CreateEcosystemCommand } from '@module-eco/application/use-cases/create-ecosystem/create-ecosystem.command';

@Injectable()
export class CreateEcosystemService implements IApplicationServiceCommand<CreateEcosystemCommand> {
  constructor(
    @Inject(ECOSYSTEM_REPOSITORY)
    private ecosystemRepository: IEcosystemRepository,
  ) {}

  async process<T extends CreateEcosystemCommand>(command: T): Promise<Ecosystem> {
    const { name, description, isEnabled } = command;

    const isNameAvailable = await this.ecosystemRepository.isNameAvailable(name);

    if (!isNameAvailable) {
      throw new EcosystemNameAlreadyUsedException();
    }

    const ecosystem = new Ecosystem(name, description, isEnabled);

    await this.ecosystemRepository.persist(ecosystem);

    return ecosystem;
  }
}
