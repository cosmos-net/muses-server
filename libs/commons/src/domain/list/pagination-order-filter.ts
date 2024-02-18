import { IOrderOptions } from '@lib-commons/domain/list/order/order-options';
import { IPagination } from '@lib-commons/domain/list/pagination/pagination';
import { IFilterOptions } from '@lib-commons/domain/list/filter/filter-options';

export interface IPaginationOrder {
  options: {
    order: IOrderOptions;
    pagination: IPagination;
    filter?: IFilterOptions;
  };
}
