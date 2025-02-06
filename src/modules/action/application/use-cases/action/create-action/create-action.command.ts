import { ICommand } from '@core/domain/contracts/presentation/command';

export class CreateActionCommand implements ICommand {
  readonly name: string;

  readonly description: string;

  readonly moduleId: string;

  readonly submoduleId?: string;

  readonly actionCatalog: string;

  constructor(props: CreateActionCommand) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
