import {
  Inject,
  Injectable,
  Logger
} from '@nestjs/common';
import { ECOSYSTEM_REPOSITORY } from '@management-main/modules/ecosystem/application/constants/injection-token';
import { ConfigService } from '@nestjs/config';
import { IEcosystemRepository } from '@management-main/modules/commons/domain/contracts/ecosystem-repository';
import { UpdateEcosystemCommand } from './update-ecosystem.command';
import { IApplicationServiceCommand } from '@management-commons/application/application-service-command';
import { Ecosystem } from '@management-main/modules/ecosystem/domain/ecosystem';

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

      await this.ecosystemRepository.persist(ecosystem);

      return ecosystem;
  }
}
