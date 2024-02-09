import { PageDto, IPagination, PaginationMetadataDto } from '@lib-commons/infrastructure';

interface IUpdateEcosystemOutputDto {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt?: Date | string;
}
interface IUpdateEcosystemOutputDtoResponse {
  list: IUpdateEcosystemOutputDto[];
  total: number;
}

export class ListEcosystemOutputDto {
  readonly items: IUpdateEcosystemOutputDto[];
  readonly meta?: PaginationMetadataDto;

  constructor(items: IUpdateEcosystemOutputDtoResponse, pagination: IPagination) {
    const list = items.list.map((item) => {
      return {
        id: item.id,
        name: item.name,
        description: item.description,
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

    const { items: itemsPage, meta } = new PageDto<IUpdateEcosystemOutputDto>(list, paginationMetadataDto);

    this.items = itemsPage;
    this.meta = meta;
  }
}
