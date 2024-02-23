import { ICommand } from '@lib-commons/domain/contracts/presentation/command';

export class DeleteModuleCommand implements ICommand {
  readonly id: string;

  constructor(props: Partial<DeleteModuleCommand>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
