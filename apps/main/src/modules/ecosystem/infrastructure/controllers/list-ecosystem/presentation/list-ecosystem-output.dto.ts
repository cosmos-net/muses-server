import { PageDto, IPagination, PaginationMetadataDto } from '@lib-commons/infrastructure';

interface IUpdateEcosystemOutputDto {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | string;
}

interface IUpdateEcosystemOutputDtoResponse {
  list: IUpdateEcosystemOutputDto[];
  total: number;
}

export class ListEcosystemOutputDto {
  ecosystems: PageDto<IUpdateEcosystemOutputDto>;

  constructor(items: IUpdateEcosystemOutputDtoResponse, pagination: IPagination) {
    const paginationMetadataDto = new PaginationMetadataDto({
      page: pagination.page,
      limit: pagination.limit,
      totalItems: items.total,
    });

    this.ecosystems = new PageDto<IUpdateEcosystemOutputDto>(items.list, paginationMetadataDto);
  }
}
