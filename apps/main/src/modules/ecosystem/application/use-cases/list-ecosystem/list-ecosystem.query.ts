import { IQuery } from '@lib-commons/domain';

export class ListEcosystemQuery implements IQuery {
  readonly id: string;

  readonly name: string;

  readonly description: string;

  readonly isEnabled: boolean;

  constructor(props: Partial<ListEcosystemQuery>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
