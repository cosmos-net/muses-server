import { EnumMethodValue } from '@module-resource/domain/aggregate/value-objects/method.vo';
import { ICommand } from '@lib-commons/domain/contracts/presentation/command';

export class UpdateResourceCommand implements ICommand {
  readonly id: string;

  readonly name?: string;

  readonly description?: string;

  readonly isEnabled?: boolean;

  readonly endpoint?: string;

  readonly method?: EnumMethodValue;

  readonly triggers?: string[] = [];

  readonly actions?: string[] = [];

  constructor(props: Partial<UpdateResourceCommand>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
