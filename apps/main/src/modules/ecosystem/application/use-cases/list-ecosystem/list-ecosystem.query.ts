import { IQuery } from '@lib-commons/domain';
import { Primitives } from '@lib-commons/domain/value-object/value-object';

export class ListEcosystemQuery implements IQuery {
  readonly filters: Array<Map<string, Primitives>>;

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
