import { IQuery } from '@core/domain/contracts/presentation/query';

export class GetResourceQuery implements IQuery {
  readonly id: string;

  readonly withDisabled: boolean;

  constructor(props?: Partial<GetResourceQuery>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
