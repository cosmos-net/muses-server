import { ICommand } from '@lib-commons/domain/contracts/presentation/command';

export class UpdateModuleCommand implements ICommand {
  readonly id: string;

  readonly name?: string;

  readonly description?: string;

  readonly isEnabled?: boolean;

  readonly project?: string;

  constructor(props: Partial<UpdateModuleCommand>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
