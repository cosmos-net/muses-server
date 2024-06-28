 import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  ACTION_CATALOG_REPOSITORY,
} from '@module-action/application/constants/injection-token';
import { IActionCatalogRepository } from '@module-action/domain/contracts/action-catalog-repository';
import { ActionCatalog } from '@module-action/domain/aggregate/action-catalog';
import { GetActionCatalogQuery } from '@module-action/application/use-cases/action-catalog/get-action-catalog/get-action-catalog.command';
import { IApplicationServiceQuery } from '@core/application/application-service-query';
import { isObjectIdHex } from '@core/domain/helpers/utils';

@Injectable()
export class GetActionCatalogService implements IApplicationServiceQuery<GetActionCatalogQuery> {
  constructor(
    @Inject(ACTION_CATALOG_REPOSITORY)
    private actionCatalogRepository: IActionCatalogRepository,
  ) {}

  async process<T extends GetActionCatalogQuery>(query: T): Promise<ActionCatalog> {
    const { id, name } = query;

    if (name) {
      const isObjectHex = isObjectIdHex(name);

      if (isObjectHex) {
        throw new BadRequestException('Invalid name parameter');
      }
    }

    const parameter = id ?? name;

    if (!parameter) {
      throw new BadRequestException('Id or name is required');
    }

    const actionCatalog = await this.actionCatalogRepository.oneBy(parameter);

    if (!actionCatalog) {
      throw new NotFoundException('Action catalog not found');
    }

    return actionCatalog;
  }
}
