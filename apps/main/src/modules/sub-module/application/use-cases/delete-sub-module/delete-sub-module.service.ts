import { IApplicationServiceCommand } from '@lib-commons/application/application-service-command';
import { Inject, Injectable } from '@nestjs/common';
import { SubModuleNotFoundException } from '@module-sub-module/domain/exceptions/sub-module-not-found.exception';
import { ISubModuleRepository } from '@module-sub-module/domain/contracts/sub-module-repository';
import { SUB_MODULE_REPOSITORY } from '@module-sub-module/application/constants/injection-token';
import { DeleteSubModuleCommand } from '@module-sub-module/application/use-cases/delete-sub-module/delete-sub-module.command';

@Injectable()
export class DeleteSubModuleService implements IApplicationServiceCommand<DeleteSubModuleCommand> {
  constructor(
    @Inject(SUB_MODULE_REPOSITORY)
    private subModuleRepository: ISubModuleRepository,
  ) {}

  async process<T extends DeleteSubModuleCommand>(command: T): Promise<number | undefined> {
    const { id } = command;

    const subModule = await this.subModuleRepository.searchOneBy(id, {
      withDeleted: true,
    });

    if (!subModule) {
      throw new SubModuleNotFoundException();
    }

    const result = await this.subModuleRepository.softDeleteBy(subModule);

    return result;
  }
}
