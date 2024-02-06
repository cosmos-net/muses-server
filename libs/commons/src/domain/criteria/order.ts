import { OrderBy } from '@lib-commons/domain/criteria/order-by';
import { OrderType, OrderTypes } from '@lib-commons/domain/criteria/order-type';

export class Order {
  readonly orderBy: OrderBy;
  readonly orderType: OrderType;

  constructor(orderBy: OrderBy, orderType: OrderType) {
    this.orderBy = orderBy;
    this.orderType = orderType;
  }

  static fromValues(orderBy?: string, orderType?: string): Order {
    if (!orderBy) {
      return Order.none();
    }

    return new Order(new OrderBy(orderBy), OrderType.fromValue(orderType ?? OrderTypes.ASC));
  }

  static none(): Order {
    return new Order(new OrderBy(''), new OrderType(OrderTypes.NONE));
  }

  static desc(orderBy: string): Order {
    return new Order(new OrderBy(orderBy), new OrderType(OrderTypes.DESC));
  }

  static asc(orderBy: string): Order {
    return new Order(new OrderBy(orderBy), new OrderType(OrderTypes.ASC));
  }

  public hasOrder() {
    return !this.orderType.isNone();
  }
}
