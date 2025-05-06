import { IQuery } from '@core/domain/contracts/presentation/query';

export class RetrieveEcosystemQuery implements IQuery {
  id: string;

  withDisabled: boolean;

  constructor(props: Partial<RetrieveEcosystemQuery>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
