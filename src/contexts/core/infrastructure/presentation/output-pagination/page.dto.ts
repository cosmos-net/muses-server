import { PaginationMetadataDto } from '@core/infrastructure/presentation/output-pagination/pagination-metadata.dto';

export class PageDto<T> {
  readonly items: T[];

  readonly meta?: PaginationMetadataDto;

  constructor(data: T[], meta?: PaginationMetadataDto) {
    this.items = data;
    this.meta = meta;
  }
}
