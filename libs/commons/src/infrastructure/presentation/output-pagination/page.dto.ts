import { PaginationMetadataDto } from '@lib-commons/infrastructure';

export class PageDto<T> {
  readonly items: T[];

  readonly meta?: PaginationMetadataDto;

  constructor(data: T[], meta?: PaginationMetadataDto) {
    this.items = data;
    this.meta = meta;
  }
}
