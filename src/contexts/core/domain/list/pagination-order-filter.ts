import { IOrderOptions } from '@core/domain/list/order/order-options';
import { IPagination } from '@core/domain/list/pagination/pagination';
import { IFilterOptions } from '@core/domain/list/filter/filter-options';

export interface IPaginationOrder {
  options: {
    order: IOrderOptions;
    pagination: IPagination;
    filter?: IFilterOptions;
  };
}
