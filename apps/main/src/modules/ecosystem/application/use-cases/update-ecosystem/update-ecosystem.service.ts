import { Inject, Injectable, Logger } from '@nestjs/common';
import { ECOSYSTEM_REPOSITORY, UpdateEcosystemCommand } from '@module-eco/application/';
import { ConfigService } from '@nestjs/config';
import { IApplicationServiceCommand } from '@lib-commons/application';
import { Ecosystem } from '@app-main/modules/ecosystem/domain';
import { IEcosystemRepository } from '@app-main/modules/ecosystem/domain/contracts/ecosystem-repository';

@Injectable()
export class UpdateEcosystemService implements IApplicationServiceCommand<UpdateEcosystemCommand> {
  private logger = new Logger(UpdateEcosystemService.name);

  constructor(
    @Inject(ECOSYSTEM_REPOSITORY) private ecosystemRepository: IEcosystemRepository,
    private readonly config: ConfigService,
  ) {}

  async process<T extends UpdateEcosystemCommand>(command: T): Promise<Ecosystem> {
    const { id, name, description, isEnabled } = command;

    const ecosystem = await this.ecosystemRepository.byIdOrFail(id);

    // TODO: check values to update before update the ecosystem
    ecosystem.describe(name, description);
    isEnabled ? ecosystem.enabled() : ecosystem.disabled();

    await this.ecosystemRepository.persist(ecosystem);

    return ecosystem;
  }
}
