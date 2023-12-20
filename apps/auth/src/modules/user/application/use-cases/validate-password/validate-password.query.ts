import { IQuery } from '@lib-commons/domain';

export class ValidatePasswordQuery implements IQuery {
  email: string;
  password: string;

  constructor(props?: Partial<ValidatePasswordQuery>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
