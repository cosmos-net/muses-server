import { ICommand } from '@lib-commons/domain';

export class UpdateProjectCommand implements ICommand {
  readonly id: string;

  readonly name?: string;

  readonly description?: string;

  readonly enabled?: boolean;

  readonly ecosystem?: string;

  constructor(props: Partial<UpdateProjectCommand>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
