import { IQuery } from '@core/domain/contracts/presentation/query';

export class GetActionCatalogQuery implements IQuery {
  readonly name?: string;

  readonly id?: string;

  constructor(props?: GetActionCatalogQuery) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
