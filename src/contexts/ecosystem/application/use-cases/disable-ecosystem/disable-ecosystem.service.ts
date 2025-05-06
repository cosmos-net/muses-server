import { Inject, Injectable } from '@nestjs/common';
import { DisableEcosystemCommand } from '@context-ecosystem/application/use-cases/disable-ecosystem/disable-ecosystem.command';
import { ECOSYSTEM_REPOSITORY } from '@context-ecosystem/application/constants/injection-token';
import { IApplicationServiceCommand } from '@core/application/application-service-command';
import { IEcosystemRepository } from '@context-ecosystem/domain/contracts/ecosystem-repository';

@Injectable()
export class DisableEcosystemService implements IApplicationServiceCommand<DisableEcosystemCommand> {
  constructor(
    @Inject(ECOSYSTEM_REPOSITORY)
    private ecosystemRepository: IEcosystemRepository,
  ) {}

  async process<T extends DisableEcosystemCommand>(command: T): Promise<number> {
    const { id } = command;

    const ecosystem = await this.ecosystemRepository.byIdOrFail(id, true);

    ecosystem.disable();

    await this.ecosystemRepository.persist(ecosystem);

    return 1;
  }
}
