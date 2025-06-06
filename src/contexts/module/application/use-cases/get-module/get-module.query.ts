import { IQuery } from '@core/domain/contracts/presentation/query';

export class GetModuleQuery implements IQuery {
  readonly id: string;

  readonly withDisabled: boolean = false;

  readonly withProject: boolean = false;

  constructor(props?: Partial<GetModuleQuery>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
