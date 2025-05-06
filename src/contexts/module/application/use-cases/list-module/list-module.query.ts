import { IQuery } from '@core/domain/contracts/presentation/query';
import { Primitives } from '@core/domain/value-object/value-object';

export class ListModuleQuery implements IQuery {
  readonly filters: Array<Map<string, Primitives>>;

  readonly orderBy?: string;

  readonly orderType?: string;

  readonly limit?: number;

  readonly offset?: number;

  readonly withDeleted?: boolean;

  constructor(props: Partial<ListModuleQuery>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
