import { IPagination } from '@core/domain/list/pagination/pagination';
import { PageDto } from '@core/infrastructure/presentation/output-pagination/page.dto';
import { PaginationMetadataDto } from '@core/infrastructure/presentation/output-pagination/pagination-metadata.dto';

interface IListActionOutputDto {
  id?: string;
  name: string;
  description: string;
  modules: (object | string)[] | undefined;
  subModules: (object | string)[] | undefined;
  actionCatalog: any;
  isEnabled: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt?: string | Date;
}

interface IListActionOutputDtoResponse {
  list: IListActionOutputDto[];
  total: number;
}

export class ListActionOutputDto {
  readonly items: IListActionOutputDto[];
  readonly meta?: PaginationMetadataDto;

  constructor(items: IListActionOutputDtoResponse, pagination: IPagination) {
    const list = items.list.map((item) => {
      return {
        id: item.id,
        name: item.name,
        description: item.description,
        modules: item.modules,
        subModules: item.subModules,
        actionCatalog: item.actionCatalog,
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

    const { items: itemsPage, meta } = new PageDto<IListActionOutputDto>(list, paginationMetadataDto);

    this.items = itemsPage;
    this.meta = meta;
  }
}
