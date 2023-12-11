import { IQuery } from '@management-commons/domain/contracts/presentation/query';

export class GetUserQuery implements IQuery {
  email: string;

  constructor(props?: Partial<GetUserQuery>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
