import { IApplicationServiceCommand } from '@core/application/application-service-command';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateActionCatalogCommand } from '@module-action/application/use-cases/action-catalog/create-action-catalog/create-action-catalog.command';
import {
  ACTION_CATALOG_REPOSITORY,
} from '@module-action/application/constants/injection-token';
import { IActionCatalogRepository } from '@module-action/domain/contracts/action-catalog-repository';
import { ActionCatalog } from '@module-action/domain/aggregate/action-catalog';

@Injectable()
export class CreateActionCatalogService implements IApplicationServiceCommand<CreateActionCatalogCommand> {
  constructor(
    @Inject(ACTION_CATALOG_REPOSITORY)
    private actionCatalogRepository: IActionCatalogRepository,
  ) {}

  async process<T extends CreateActionCatalogCommand>(command: T): Promise<ActionCatalog> {
    const { name } = command;

    const isNameAvailable = await this.actionCatalogRepository.oneBy(name);

    if (isNameAvailable) {
      throw new BadRequestException('Action name already used');
    }

    const actionCatalog = new ActionCatalog({
      name
    });

    await this.actionCatalogRepository.persist(actionCatalog);


    return actionCatalog;
  }
}
