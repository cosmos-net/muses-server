import { ICommand } from '@core/domain/contracts/presentation/command';

export class DisableResourceCommand implements ICommand {
  readonly id: string;

  constructor(props: Partial<DisableResourceCommand>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
