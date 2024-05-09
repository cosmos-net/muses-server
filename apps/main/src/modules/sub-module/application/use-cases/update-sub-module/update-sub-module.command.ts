import { ICommand } from '@lib-commons/domain/contracts/presentation/command';

export class UpdateSubModuleCommand implements ICommand {
  readonly id: string;

  readonly name?: string;

  readonly description?: string;

  readonly isEnabled?: boolean;

  readonly module?: string;

  constructor(props: Partial<UpdateSubModuleCommand>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
