import { ICommand } from '@lib-commons/domain/contracts/presentation/command';

export class RemoveProjectCommand implements ICommand {
  public readonly ecosystemId: string;

  public readonly projectId: string;

  constructor(props?: Partial<RemoveProjectCommand>) {
    if (props !== undefined) {
      Object.assign(this, props);
    }
  }
}
