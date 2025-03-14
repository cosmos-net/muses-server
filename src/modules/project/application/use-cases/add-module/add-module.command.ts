import { ICommand } from '@core/domain/contracts/presentation/command';

export class AddModuleCommand implements ICommand {
  readonly moduleId: string;

  readonly projectId: string;

  constructor(props: Partial<AddModuleCommand>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
