import { Filters } from '@lib-commons/domain/criteria/filters';
import { Order } from '@lib-commons/domain/criteria/order';

export class Criteria {
  readonly filters: Filters;
  readonly order: Order;
  readonly limit?: number;
  readonly offset?: number;
  readonly withDeleted?: boolean = false;

  constructor(filters: Filters, order: Order, limit?: number, offset?: number, withDeleted?: boolean) {
    this.filters = filters;
    this.order = order;
    this.limit = limit;
    this.offset = offset;
    this.withDeleted = withDeleted;
  }

  public hasFilters(): boolean {
    return this.filters.filters.length > 0;
  }

  public hasOrder(): boolean {
    return this.order.hasOrder();
  }
}
