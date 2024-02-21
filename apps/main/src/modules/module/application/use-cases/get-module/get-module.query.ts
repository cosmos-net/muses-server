import { IQuery } from '@lib-commons/domain/contracts/presentation/query';

export class GetModuleQuery implements IQuery {
  readonly id: string;

  readonly withDisabled: boolean = false;

  constructor(props?: Partial<GetModuleQuery>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
