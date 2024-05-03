import { IPagination } from '@lib-commons/domain/list/pagination/pagination';
import { PageDto } from '@lib-commons/infrastructure/presentation/output-pagination/page.dto';
import { PaginationMetadataDto } from '@lib-commons/infrastructure/presentation/output-pagination/pagination-metadata.dto';

interface IListModuleOutputDto {
  id?: string;
  name: string;
  description: string;
  project: object | string;
  isEnabled: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt?: string | Date;
}

interface IListModuleOutputDtoResponse {
  list: IListModuleOutputDto[];
  total: number;
}

export class ListModuleOutputDto {
  readonly items: IListModuleOutputDto[];
  readonly meta?: PaginationMetadataDto;

  constructor(items: IListModuleOutputDtoResponse, pagination: IPagination) {
    const list = items.list.map((item) => {
      return {
        id: item.id,
        name: item.name,
        description: item.description,
        project: item.project,
        isEnabled: item.isEnabled,
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

    const { items: itemsPage, meta } = new PageDto<IListModuleOutputDto>(list, paginationMetadataDto);

    this.items = itemsPage;
    this.meta = meta;
  }
}
