import {
  IOrderOptions,
  IPagination,
  IFilterOptions,
} from '@lib-commons/domain';

export interface IPaginationOrder {
  options: {
    order: IOrderOptions;
    pagination: IPagination;
    filter?: IFilterOptions;
  };
}
