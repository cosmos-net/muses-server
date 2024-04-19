import { Inject, Injectable } from '@nestjs/common';
import { ECOSYSTEM_REPOSITORY } from '@module-eco/application/constants/injection-token';
import { UpdateEcosystemCommand } from '@module-eco/application/use-cases/update-ecosystem/update-ecosystem.command';
import { IApplicationServiceCommand } from '@lib-commons/application/application-service-command';
import { Ecosystem } from '@module-eco/domain/aggregate/ecosystem';
import { IEcosystemRepository } from '@module-eco/domain/contracts/ecosystem-repository';

@Injectable()
export class UpdateEcosystemService implements IApplicationServiceCommand<UpdateEcosystemCommand> {
  constructor(
    @Inject(ECOSYSTEM_REPOSITORY)
    private ecosystemRepository: IEcosystemRepository,
  ) {}

  async process<T extends UpdateEcosystemCommand>(command: T): Promise<Ecosystem> {
    const { id, name, description, isEnabled } = command;
    const withDeleted = isEnabled === false;

    const ecosystem = await this.ecosystemRepository.byIdOrFail(id, withDeleted);

    ecosystem.redescribe(name, description);

    if (isEnabled !== undefined) {
      isEnabled ? ecosystem.enable() : ecosystem.disable();
    }

    await this.ecosystemRepository.persist(ecosystem);

    return ecosystem;
  }
}
