import { ICommand } from '@core/domain/contracts/presentation/command';

export class AddResourceCommand implements ICommand {
  readonly resourceId: string;

  readonly actionsIds: string[];

  constructor(props?: Partial<AddResourceCommand>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
