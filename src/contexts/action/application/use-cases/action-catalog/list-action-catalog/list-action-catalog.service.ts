import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  ACTION_CATALOG_REPOSITORY,
} from '@module-action/application/constants/injection-token';
import { IActionCatalogRepository } from '@module-action/domain/contracts/action-catalog-repository';
import { ListActionCatalog } from '@module-action/domain/aggregate/list-action-catalog';

@Injectable()
export class ListActionCatalogService {
  constructor(
    @Inject(ACTION_CATALOG_REPOSITORY)
    private actionCatalogRepository: IActionCatalogRepository,
  ) {}

  async process(): Promise<ListActionCatalog> {

    const listActionCatalog = await this.actionCatalogRepository.list();

    if (listActionCatalog.totalItems === 0) {
      throw new NotFoundException('Action catalog is empty');
    }

    return listActionCatalog;
  }
}
