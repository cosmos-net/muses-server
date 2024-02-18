import { Inject, Injectable, Logger } from '@nestjs/common';
import { ECOSYSTEM_REPOSITORY } from '@module-eco/application/constants/injection-token';
import { UpdateEcosystemCommand } from '@module-eco/application/use-cases/update-ecosystem/update-ecosystem.command';
import { ConfigService } from '@nestjs/config';
import { IApplicationServiceCommand } from '@lib-commons/application/application-service-command';
import { Ecosystem } from '@module-eco/domain/aggregate/ecosystem';
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
