import { Inject, Injectable, Logger } from '@nestjs/common';
import { ECOSYSTEM_REPOSITORY, UpdateEcosystemCommand } from '@module-eco/application/';
import { ConfigService } from '@nestjs/config';
import { IApplicationServiceCommand } from '@lib-commons/application';
import { Ecosystem } from '@module-eco/domain';
import { IEcosystemRepository } from '@module-eco/domain/contracts/ecosystem-repository';

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

    if (name || description) {
      ecosystem.redescribe(name, description);
    }

    if (isEnabled !== undefined) {
      isEnabled ? ecosystem.enable() : ecosystem.disable();
    }

    await this.ecosystemRepository.persist(ecosystem);

    return ecosystem;
  }
}
