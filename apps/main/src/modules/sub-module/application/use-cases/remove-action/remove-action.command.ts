import { ICommand } from '@lib-commons/domain/contracts/presentation/command';

export class RemoveActionCommand implements ICommand {
  readonly actionId: string;

  readonly subModules: string[];

  constructor(props?: Partial<RemoveActionCommand>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
