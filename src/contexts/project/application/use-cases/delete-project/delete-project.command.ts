import { ICommand } from '@core/domain/contracts/presentation/command';

export class DeleteProjectCommand implements ICommand {
  readonly id: string;

  constructor(props: Partial<DeleteProjectCommand>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
