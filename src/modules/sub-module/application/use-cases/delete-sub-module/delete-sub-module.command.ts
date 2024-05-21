import { ICommand } from '@core/domain/contracts/presentation/command';

export class DeleteSubModuleCommand implements ICommand {
  readonly id: string;

  constructor(props: Partial<DeleteSubModuleCommand>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
