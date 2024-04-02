import { ICommand } from '@lib-commons/domain/contracts/presentation/command';

export class DisableActionCommand implements ICommand {
  readonly id: string;

  constructor(props: Partial<DisableActionCommand>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
