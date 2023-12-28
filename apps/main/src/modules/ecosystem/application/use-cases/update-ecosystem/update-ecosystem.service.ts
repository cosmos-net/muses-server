import { Inject, Injectable, Logger } from '@nestjs/common';
import { ECOSYSTEM_REPOSITORY, UpdateEcosystemCommand } from '@app-main/modules/ecosystem/application/';
import { ConfigService } from '@nestjs/config';
import { IEcosystemRepository } from '@app-main/modules/commons/domain';
import { IApplicationServiceCommand } from '@lib-commons/application';
import { Ecosystem } from '@app-main/modules/ecosystem/domain';

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

    ecosystem.describe(name, description);
    isEnabled ? ecosystem.enabled() : ecosystem.disabled();

    await this.ecosystemRepository.update(ecosystem);

    return ecosystem;
  }
}
