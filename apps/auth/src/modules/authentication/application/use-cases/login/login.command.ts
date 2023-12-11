import { ICommand } from '@management-commons/domain/contracts/presentation/command';

export class LoginCommand implements ICommand {
  readonly username: string;

  readonly password: string;

  readonly secret: string;

  readonly expiresIn: string | number;

  constructor(props: Partial<LoginCommand>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
