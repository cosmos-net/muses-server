import { ICommand } from '@lib-commons/domain';

export class CreateEcosystemCommand implements ICommand {
  readonly name: string;

  readonly description?: string;

  readonly enabled: boolean;

  constructor(props: Partial<CreateEcosystemCommand>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
