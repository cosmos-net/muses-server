import { IQuery } from '@lib-commons/domain';

export class ListEcosystemQuery implements IQuery {
  readonly filters: Array<Map<string, string>>;

  readonly orderBy?: string;

  readonly orderType?: string;

  readonly limit?: number;

  readonly offset?: number;

  constructor(props: Partial<ListEcosystemQuery>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
