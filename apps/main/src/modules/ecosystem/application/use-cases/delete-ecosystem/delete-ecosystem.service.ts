import { Inject, Injectable } from '@nestjs/common';
import { ECOSYSTEM_REPOSITORY, DeleteEcosystemCommand } from '@app-main/modules/ecosystem/application/';
import { IEcosystemRepository } from '@app-main/modules/commons/domain';
import { IApplicationServiceCommand } from '@lib-commons/application';

@Injectable()
export class DeleteEcosystemService implements IApplicationServiceCommand<DeleteEcosystemCommand> {
  constructor(@Inject(ECOSYSTEM_REPOSITORY) private ecosystemRepository: IEcosystemRepository) {}

  async process<T extends DeleteEcosystemCommand>(command: T): Promise<number | undefined> {
    const { id } = command;

    const result = await this.ecosystemRepository.softDeleteBy(id);

    return result;
  }
}
