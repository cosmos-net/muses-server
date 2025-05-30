import { ICommand } from '@core/domain/contracts/presentation/command';

export class RemoveResourceCommand implements ICommand {
  readonly resourceId: string;

  readonly actionsIds: string[];

  constructor(props?: Partial<RemoveResourceCommand>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
