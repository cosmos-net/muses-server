import { ICommand } from '@lib-commons/domain/contracts/presentation/command';

export class AddProjectCommand implements ICommand {
  public readonly ecosystemId: string;

  public readonly projectId: string;

  constructor(props?: Partial<AddProjectCommand>) {
    if (props !== undefined) {
      Object.assign(this, props);
    }
  }
}
