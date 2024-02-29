import { ICommand } from '@lib-commons/domain/contracts/presentation/command';

export class AddSubModuleCommand implements ICommand {
  readonly subModuleId: string;

  readonly moduleId: string;

  constructor(props: Partial<AddSubModuleCommand>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
