import { IQuery } from '@lib-commons/domain';

export class GetHealthQuery implements IQuery {
  url: string;

  name: string;

  constructor(query: Partial<GetHealthQuery>) {
    Object.assign(this, query);
  }
}
