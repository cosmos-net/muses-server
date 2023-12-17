import { IQuery } from '@lib-commons/domain';

export class GetUserQuery implements IQuery {
  email: string;

  constructor(props?: Partial<GetUserQuery>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
