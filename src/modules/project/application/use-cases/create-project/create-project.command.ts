import { ICommand } from '@core/domain/contracts/presentation/command';

export class CreateProjectCommand implements ICommand {
  readonly name: string;

  readonly description?: string;

  readonly isEnabled?: boolean;

  readonly ecosystem?: string;

  constructor(props: Partial<CreateProjectCommand>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
