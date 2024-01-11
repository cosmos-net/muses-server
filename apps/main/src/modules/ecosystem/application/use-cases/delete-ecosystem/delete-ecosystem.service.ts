import { Inject, Injectable, Logger } from '@nestjs/common';
import { ECOSYSTEM_REPOSITORY, DeleteEcosystemCommand } from '@app-main/modules/ecosystem/application/';
import { ConfigService } from '@nestjs/config';
import { IEcosystemRepository } from '@app-main/modules/commons/domain';
import { IApplicationServiceCommand } from '@lib-commons/application';

@Injectable()
export class DeleteEcosystemService implements IApplicationServiceCommand<DeleteEcosystemCommand> {
  private logger = new Logger(DeleteEcosystemService.name);

  constructor(
    @Inject(ECOSYSTEM_REPOSITORY) private ecosystemRepository: IEcosystemRepository, 
    private readonly config: ConfigService,
  ) {}

  async process<T extends DeleteEcosystemCommand>(command: T): Promise<void> {
    const { id } = command;
    await this.ecosystemRepository.delete(id);
  }
}
