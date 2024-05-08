import { IQuery } from '@lib-commons/domain/contracts/presentation/query';

export class GetProjectQuery implements IQuery {
  readonly id: string;

  readonly withDisabled: boolean = false;

  readonly withEcosystem?: boolean = true;

  constructor(props: Partial<GetProjectQuery>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
