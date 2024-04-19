import { IQuery } from '@lib-commons/domain/contracts/presentation/query';

export class RetrieveEcosystemQuery implements IQuery {
  id: string;

  withDeleted: boolean;

  constructor(props: Partial<RetrieveEcosystemQuery>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
