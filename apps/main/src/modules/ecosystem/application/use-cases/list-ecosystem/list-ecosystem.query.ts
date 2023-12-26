import { IPagination, IOrderOptions, IFilterOptions, IQuery } from '@lib-commons/domain';

export class ListEcosystemQuery implements IQuery {
  filter?: IFilterOptions;

  pagination: IPagination;

  order: IOrderOptions;

  constructor(props: Partial<ListEcosystemQuery>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
