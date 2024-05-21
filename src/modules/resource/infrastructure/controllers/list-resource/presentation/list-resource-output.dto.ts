import { IActionSchema } from '@module-action/domain/aggregate/action.schema';
import { IResourceSchema } from '@module-resource/domain/aggregate/resource.schema';
import { EnumMethodValue } from '@module-resource/domain/aggregate/value-objects/method.vo';
import { IPagination } from '@core/domain/list/pagination/pagination';
import { PageDto } from '@core/infrastructure/presentation/output-pagination/page.dto';
import { PaginationMetadataDto } from '@core/infrastructure/presentation/output-pagination/pagination-metadata.dto';

interface IListResourceOutputDto {
  id: string | any;
  name: string;
  description: string;
  isEnabled: boolean;
  endpoint: string;
  method: EnumMethodValue;
  triggers?: IResourceSchema[] | string[] | null | any;
  actions: IActionSchema[] | string[] | any;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface IListResourceOutputDtoResponse {
  list: IListResourceOutputDto[];
  total: number;
}

export class ListResourceOutputDto {
  readonly items: IListResourceOutputDto[];
  readonly meta?: any;

  constructor(items: IListResourceOutputDtoResponse, pagination: IPagination) {
    const list = items.list.map((item) => {
      return {
        id: item.id,
        name: item.name,
        description: item.description,
        isEnabled: item.isEnabled,
        endpoint: item.endpoint,
        method: item.method,
        triggers: item.triggers,
        actions: item.actions,
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

    const { items: itemsPage, meta } = new PageDto<IListResourceOutputDto>(list, paginationMetadataDto);

    this.items = itemsPage;
    this.meta = meta;
  }
}
