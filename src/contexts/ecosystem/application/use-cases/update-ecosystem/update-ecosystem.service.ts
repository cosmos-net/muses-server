import { Inject, Injectable } from '@nestjs/common';
import { ECOSYSTEM_REPOSITORY } from '@context-ecosystem/application/constants/injection-token';
import { UpdateEcosystemCommand } from '@context-ecosystem/application/use-cases/update-ecosystem/update-ecosystem.command';
import { IApplicationServiceCommand } from '@core/application/application-service-command';
import { Ecosystem } from '@context-ecosystem/domain/aggregate/ecosystem';
import { IEcosystemRepository } from '@context-ecosystem/domain/contracts/ecosystem-repository';

@Injectable()
export class UpdateEcosystemService implements IApplicationServiceCommand<UpdateEcosystemCommand> {
  constructor(
    @Inject(ECOSYSTEM_REPOSITORY)
    private ecosystemRepository: IEcosystemRepository,
  ) {}

  async process<T extends UpdateEcosystemCommand>(command: T): Promise<Ecosystem> {
    const { id, name, description, isEnabled } = command;

    const ecosystem = await this.ecosystemRepository.byIdOrFail(id, true);

    ecosystem.redescribe(name, description);

    if (isEnabled !== undefined) {
      isEnabled ? ecosystem.enable() : ecosystem.disable();
    }

    await this.ecosystemRepository.persist(ecosystem);

    return ecosystem;
  }
}
