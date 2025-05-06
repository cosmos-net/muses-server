import { Inject, Injectable } from '@nestjs/common';
import { ECOSYSTEM_REPOSITORY } from '@context-ecosystem/application/constants/injection-token';
import { IApplicationServiceCommand } from '@core/application/application-service-command';
import { Ecosystem } from '@context-ecosystem/domain/aggregate/ecosystem';
import { IEcosystemRepository } from '@context-ecosystem/domain/contracts/ecosystem-repository';
import { EcosystemNameAlreadyUsedException } from '@context-ecosystem/domain/exceptions/ecosystem-name-already-used.exception';
import { CreateEcosystemCommand } from '@context-ecosystem/application/use-cases/create-ecosystem/create-ecosystem.command';

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
