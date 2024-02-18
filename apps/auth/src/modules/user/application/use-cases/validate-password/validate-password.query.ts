import { IQuery } from '@lib-commons/domain/contracts/presentation/query';

export class ValidatePasswordQuery implements IQuery {
  token: string;
  password: string;

  constructor(props?: Partial<ValidatePasswordQuery>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
