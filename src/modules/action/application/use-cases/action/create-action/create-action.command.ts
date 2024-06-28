import { ICommand } from '@core/domain/contracts/presentation/command';

export class CreateActionCommand implements ICommand {
  readonly name: string;

  readonly description: string;

  readonly modules?: string[];

  readonly subModules?: string[];

  readonly actionCatalog: string;

  constructor(props: Partial<CreateActionCommand>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
