import { IQuery } from '@lib-commons/domain';

export class GetProjectQuery implements IQuery {
  readonly id: string;

  constructor(props: Partial<GetProjectQuery>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
