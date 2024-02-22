import { ICommand } from '@lib-commons/domain/contracts/presentation/command';

export class ExchangeModuleProjectsCommand implements ICommand {
  readonly moduleId: string;

  readonly previousProjectId: string;

  readonly newProjectId: string;

  constructor(props: Partial<ExchangeModuleProjectsCommand>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
