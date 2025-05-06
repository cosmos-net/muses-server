import { ICommand } from '@core/domain/contracts/presentation/command';

export class UpdateProjectCommand implements ICommand {
  readonly id: string;

  readonly name?: string;

  readonly description?: string;

  readonly isEnabled?: boolean;

  readonly ecosystem?: string;

  constructor(props: Partial<UpdateProjectCommand>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
