import { IQuery } from '@lib-commons/domain/contracts/presentation/query';

export class GetActionQuery implements IQuery {
  readonly id: string;

  readonly withDisabled: boolean = false;

  constructor(props?: Partial<GetActionQuery>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
