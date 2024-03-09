import { IModuleSchema } from '@module-module/domain/aggregate/module.schema';
import { IPagination } from '@lib-commons/domain/list/pagination/pagination';
import { PageDto } from '@lib-commons/infrastructure/presentation/output-pagination/page.dto';
import { PaginationMetadataDto } from '@lib-commons/infrastructure/presentation/output-pagination/pagination-metadata.dto';

interface IListSubModuleOutputDto {
  id?: string;
  name: string;
  description: string;
  module: IModuleSchema | string;
  isEnabled: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt?: string | Date;
}

interface IListSubModuleOutputDtoResponse {
  list: IListSubModuleOutputDto[];
  total: number;
}

export class ListSubModuleOutputDto {
  readonly items: IListSubModuleOutputDto[];
  readonly meta?: PaginationMetadataDto;

  constructor(items: IListSubModuleOutputDtoResponse, pagination: IPagination) {
    const list = items.list.map((item) => {
      return {
        id: item.id,
        name: item.name,
        description: item.description,
        isEnabled: item.isEnabled,
        module: item.module,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        deletedAt: item.deletedAt,
      };
    });

    const paginationMetadataDto = new PaginationMetadataDto({
      page: pagination.page,
      limit: pagination.limit,
      totalItems: items.total,
    });

    const { items: itemsPage, meta } = new PageDto<IListSubModuleOutputDto>(list, paginationMetadataDto);

    this.items = itemsPage;
    this.meta = meta;
  }
}
