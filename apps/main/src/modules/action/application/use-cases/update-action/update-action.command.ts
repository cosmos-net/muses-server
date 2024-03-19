import { ICommand } from '@lib-commons/domain/contracts/presentation/command';

export class UpdateActionCommand implements ICommand {
  readonly id: string;

  readonly name?: string;

  readonly description?: string;

  readonly enabled?: boolean;

  readonly modules?: string[];

  readonly subModules?: string[];

  constructor(props: Partial<UpdateActionCommand>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
