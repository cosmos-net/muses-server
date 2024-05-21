import { ICommand } from '@core/domain/contracts/presentation/command';

export class UpdateActionCommand implements ICommand {
  readonly id: string;

  readonly name?: string;

  readonly description?: string;

  readonly isEnabled?: boolean;

  readonly modules?: string[];

  readonly subModules?: string[];

  constructor(props: Partial<UpdateActionCommand>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
