import { IQuery } from '@lib-commons/domain';

export class RetrieveEcosystemQuery implements IQuery {
  id: string;

  constructor(props: Partial<RetrieveEcosystemQuery>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
