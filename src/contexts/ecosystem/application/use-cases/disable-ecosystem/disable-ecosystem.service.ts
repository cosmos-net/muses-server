import { Inject, Injectable } from '@nestjs/common';
import { DisableEcosystemCommand } from '@module-eco/application/use-cases/disable-ecosystem/disable-ecosystem.command';
import { ECOSYSTEM_REPOSITORY } from '@module-eco/application/constants/injection-token';
import { IApplicationServiceCommand } from '@core/application/application-service-command';
import { IEcosystemRepository } from '@module-eco/domain/contracts/ecosystem-repository';

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
