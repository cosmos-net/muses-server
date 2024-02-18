import { SortEnum } from '@lib-commons/domain/list/order/sort.enum';

export interface IOrderOptions {
  direction: SortEnum;
  by: string;
}
