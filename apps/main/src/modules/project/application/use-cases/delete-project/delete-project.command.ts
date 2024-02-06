import { ICommand } from '@lib-commons/domain';

export class DeleteProjectCommand implements ICommand {
  readonly id: string;

  constructor(props: Partial<DeleteProjectCommand>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
