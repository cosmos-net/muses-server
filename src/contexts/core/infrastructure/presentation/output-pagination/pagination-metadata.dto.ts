export class PaginationMetadataDto {
  readonly page: number;

  readonly limit: number;

  readonly totalItems: number;

  readonly totalPages: number;

  readonly hasPreviousPage: boolean;

  readonly hasNextPage: boolean;

  // TODO: rename totalItems
  constructor({ page, limit, totalItems }: { page: number; limit: number; totalItems: number }) {
    this.page = page;
    this.limit = limit;
    this.totalItems = totalItems;
    this.totalPages = Math.ceil(this.totalItems / this.limit);

    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.totalPages;
  }
}
