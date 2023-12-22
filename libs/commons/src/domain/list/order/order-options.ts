import { SortEnum } from '@lib-commons/domain';

export interface IOrderOptions {
  direction: SortEnum;
  by?: string;
}
