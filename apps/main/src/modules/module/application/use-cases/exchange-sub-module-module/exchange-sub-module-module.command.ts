import { ICommand } from '@lib-commons/domain/contracts/presentation/command';

export class ExchangeSubModuleModuleCommand implements ICommand {
  readonly subModuleId: string;

  readonly previousModuleId: string;

  readonly newModuleId: string;

  constructor(props: Partial<ExchangeSubModuleModuleCommand>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
