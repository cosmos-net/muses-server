import { IQuery } from '@lib-commons/domain/contracts/presentation/query';
import { Primitives } from '@lib-commons/domain/value-object/value-object';

export class ListSubModuleQuery implements IQuery {
  readonly filters: Array<Map<string, Primitives>>;

  readonly orderBy?: string;

  readonly orderType?: string;

  readonly limit?: number;

  readonly offset?: number;

  readonly withDeleted?: boolean;

  constructor(props: Partial<ListSubModuleQuery>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
