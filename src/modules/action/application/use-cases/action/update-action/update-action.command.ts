import { ICommand } from '@core/domain/contracts/presentation/command';

export class UpdateActionCommand implements ICommand {
  readonly id: string;

  readonly name?: string;

  readonly description?: string;

  readonly isEnabled?: boolean;

  readonly module?: string;

  readonly submodule?: string;

  readonly actionCatalog?: string;

  constructor(props: UpdateActionCommand) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
