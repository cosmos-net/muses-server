import { Inject, Injectable } from '@nestjs/common';
import { DeleteEcosystemCommand } from '@module-eco/application/use-cases/delete-ecosystem/delete-ecosystem.command';
import { ECOSYSTEM_REPOSITORY } from '@module-eco/application/constants/injection-token';
import { IApplicationServiceCommand } from '@lib-commons/application/application-service-command';
import { IEcosystemRepository } from '@module-eco/domain/contracts/ecosystem-repository';

@Injectable()
export class DeleteEcosystemService implements IApplicationServiceCommand<DeleteEcosystemCommand> {
  constructor(@Inject(ECOSYSTEM_REPOSITORY) private ecosystemRepository: IEcosystemRepository) {}

  async process<T extends DeleteEcosystemCommand>(command: T): Promise<number | undefined> {
    const { id } = command;

    const result = await this.ecosystemRepository.softDeleteBy(id);

    return result;
  }
}
