import {
  PageDto,
  IPagination,
  PaginationMetadataDto,
} from '@lib-commons/infrastructure';

interface IUpdateEcosystemOutputDto {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | string;
}

export class ListEcosystemOutputDto {
  ecosystems: PageDto<IUpdateEcosystemOutputDto>;

  constructor(
    ecosystems: IUpdateEcosystemOutputDto[],
    pagination: IPagination,
  ) {
    const items = ecosystems.map<IUpdateEcosystemOutputDto>((ecosystem) => ({
      id: ecosystem.id,
      name: ecosystem.name,
      description: ecosystem.description,
      enabled: ecosystem.enabled,
      createdAt:
        ecosystem.createdAt instanceof Date
          ? ecosystem.createdAt.toISOString()
          : ecosystem.createdAt,
      updatedAt:
        ecosystem.updatedAt instanceof Date
          ? ecosystem.updatedAt.toISOString()
          : ecosystem.updatedAt,
      deletedAt:
        ecosystem.deletedAt instanceof Date
          ? ecosystem.deletedAt.toISOString()
          : ecosystem.deletedAt,
    }));

    const paginationMetadataDto = new PaginationMetadataDto({
      page: pagination.page,
      limit: pagination.limit,
      itemCount: items.length,
    });

    this.ecosystems = new PageDto<IUpdateEcosystemOutputDto>(
      items,
      paginationMetadataDto,
    );
  }
}
