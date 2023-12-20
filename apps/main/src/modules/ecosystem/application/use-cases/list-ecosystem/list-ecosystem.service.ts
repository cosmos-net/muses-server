import {
  Inject,
  Injectable,
  Logger
} from '@nestjs/common';
import { ECOSYSTEM_REPOSITORY, UpdateEcosystemCommand } from '@app-main/modules/ecosystem/application/';
import { IEcosystemRepository } from '@app-main/modules/commons/domain';
import { IApplicationServiceCommand } from '@lib-commons/application';
import { ListEcosystem } from '@module-eco/domain';

@Injectable()
export class ListEcosystemService implements IApplicationServiceCommand<UpdateEcosystemCommand> {
  private logger = new Logger(ListEcosystemService.name);

  constructor(
    @Inject(ECOSYSTEM_REPOSITORY) private ecosystemRepository: IEcosystemRepository,
  ) {}

  async process<T extends UpdateEcosystemCommand>(command: T): Promise<ListEcosystem> {
    
      const { id, name, description, isEnabled } = command;

      const ecosystems = await this.ecosystemRepository.list();

      return ecosystems;
  }
}
