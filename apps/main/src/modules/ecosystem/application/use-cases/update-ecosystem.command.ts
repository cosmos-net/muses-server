import { ICommand } from '@management-commons/domain/contracts/presentation/command';

export class UpdateEcosystemCommand implements ICommand {
  readonly id: string;

  readonly name: string;

  readonly description: string;

  readonly isEnabled: boolean;

  constructor(props: Partial<UpdateEcosystemCommand>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
