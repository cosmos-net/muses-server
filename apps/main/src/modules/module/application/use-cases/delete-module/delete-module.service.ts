import { IApplicationServiceCommand } from '@lib-commons/application/application-service-command';
import { Inject, Injectable } from '@nestjs/common';
import { DeleteModuleCommand } from '@module-module/application/use-cases/delete-module/delete-module.command';
import { MODULE_REPOSITORY } from '@module-module/application/constants/injection-tokens';
import { IModuleRepository } from '@module-module/domain/contracts/module-repository';
import { ModuleNotFoundException } from '@module-common/domain/exceptions/module-not-found.exception';

@Injectable()
export class DeleteModuleService implements IApplicationServiceCommand<DeleteModuleCommand> {
  constructor(
    @Inject(MODULE_REPOSITORY)
    private moduleRepository: IModuleRepository,
  ) {}

  async process<T extends DeleteModuleCommand>(command: T): Promise<number | undefined> {
    const { id } = command;

    const module = await this.moduleRepository.searchOneBy(id, {
      withDeleted: true,
    });

    if (!module) {
      throw new ModuleNotFoundException();
    }

    const result = await this.moduleRepository.softDeleteBy(module);

    return result;
  }
}
