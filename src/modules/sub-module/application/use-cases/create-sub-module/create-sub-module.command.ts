import { ICommand } from '@core/domain/contracts/presentation/command';

export class CreateSubModuleCommand implements ICommand {
  readonly name: string;
  readonly description: string;
  readonly module: string;
  readonly isEnabled?: boolean;

  constructor(props: Partial<CreateSubModuleCommand>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
