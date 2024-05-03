import { IPagination } from '@lib-commons/domain/list/pagination/pagination';
import { PageDto } from '@lib-commons/infrastructure/presentation/output-pagination/page.dto';
import { PaginationMetadataDto } from '@lib-commons/infrastructure/presentation/output-pagination/pagination-metadata.dto';

interface IListProjectOutputDto {
  id?: string;
  name: string;
  description: string;
  ecosystem?: string | object;
  isEnabled: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt?: string | Date;
}

interface IListProjectOutputDtoResponse {
  list: IListProjectOutputDto[];
  total: number;
}

export class ListProjectOutputDto {
  readonly items: IListProjectOutputDto[];
  readonly meta?: PaginationMetadataDto;

  constructor(items: IListProjectOutputDtoResponse, pagination: IPagination) {
    const list = items.list.map((item) => {
      return {
        id: item.id,
        name: item.name,
        description: item.description,
        isEnabled: item.isEnabled,
        ecosystem: item.ecosystem,
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

    const { items: itemsPage, meta } = new PageDto<IListProjectOutputDto>(list, paginationMetadataDto);

    this.items = itemsPage;
    this.meta = meta;
  }
}
