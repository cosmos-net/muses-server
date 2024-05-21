import { IQuery } from '@core/domain/contracts/presentation/query';

export class GetAllActionByIdsQuery implements IQuery {
  readonly ids: string[];

  readonly withDisabled: boolean = false;

  constructor(props?: Partial<GetAllActionByIdsQuery>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
