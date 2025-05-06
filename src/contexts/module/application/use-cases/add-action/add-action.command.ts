import { ICommand } from '@core/domain/contracts/presentation/command';

export class AddActionCommand implements ICommand {
  readonly actionId: string;

  readonly modules: string[];

  constructor(props: Partial<AddActionCommand>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
