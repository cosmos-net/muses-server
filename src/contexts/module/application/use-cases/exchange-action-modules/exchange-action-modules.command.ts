import { ICommand } from '@core/domain/contracts/presentation/command';

export class ExchangeActionModulesCommand implements ICommand {
  readonly actionId: string;

  readonly legacyModules: string[];

  readonly newModules: string[];

  constructor(props: Partial<ExchangeActionModulesCommand>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
