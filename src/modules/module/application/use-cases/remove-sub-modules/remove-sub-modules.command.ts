import { ICommand } from '@core/domain/contracts/presentation/command';

export class RemoveSubModuleCommand implements ICommand {
  readonly moduleId: string;

  readonly subModuleId: string;

  constructor(props?: Partial<RemoveSubModuleCommand>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
