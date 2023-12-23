import {
  IPagination,
  IOrderOptions,
  IFilterOptions,
  IQuery,
} from '@lib-commons/domain';

export class ListEcosystemQuery implements IQuery {
  readonly filter?: IFilterOptions;

  readonly pagination: IPagination;

  readonly order: IOrderOptions;

  constructor(props: Partial<ListEcosystemQuery>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
