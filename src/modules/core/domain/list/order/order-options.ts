import { SortEnum } from '@core/domain/list/order/sort.enum';

export interface IOrderOptions {
  direction: SortEnum;
  by: string;
}
