import { ICommand } from '@lib-commons/domain/contracts/presentation/command';

export class CreateSubModuleCommand implements ICommand {
  readonly name: string;
  readonly description: string;
  readonly module: string;
  readonly enabled?: boolean;

  constructor(props: Partial<CreateSubModuleCommand>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
