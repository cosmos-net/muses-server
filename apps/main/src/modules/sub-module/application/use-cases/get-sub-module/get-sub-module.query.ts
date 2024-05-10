import { IQuery } from '@lib-commons/domain/contracts/presentation/query';

export class GetSubModuleQuery implements IQuery {
  readonly id: string;

  readonly withDisabled: boolean = false;

  readonly withModules: boolean = false;

  constructor(props?: Partial<GetSubModuleQuery>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
