import { ICommand } from '@lib-commons/domain/contracts/presentation/command';

export class CreateModuleCommand implements ICommand {
  readonly name: string;

  readonly description: string;

  readonly project: string;

  readonly enabled?: boolean;

  constructor(props: Partial<CreateModuleCommand>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
