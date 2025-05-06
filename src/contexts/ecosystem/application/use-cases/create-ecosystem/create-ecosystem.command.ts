import { ICommand } from '@core/domain/contracts/presentation/command';

export class CreateEcosystemCommand implements ICommand {
  readonly name: string;

  readonly description?: string;

  readonly isEnabled?: boolean;

  constructor(props: Partial<CreateEcosystemCommand>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
