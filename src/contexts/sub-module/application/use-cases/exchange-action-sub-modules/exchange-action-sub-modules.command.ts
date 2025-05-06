import { ICommand } from '@core/domain/contracts/presentation/command';

export class ExchangeActionSubModulesCommand implements ICommand {
  readonly actionId: string;

  readonly legacySubModules: string[];

  readonly newSubModules: string[];

  constructor(props: Partial<ExchangeActionSubModulesCommand>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
