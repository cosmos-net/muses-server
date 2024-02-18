import { IQuery } from '@lib-commons/domain/contracts/presentation/query';

export class GetHealthQuery implements IQuery {
  url: string;

  name: string;

  constructor(query: Partial<GetHealthQuery>) {
    Object.assign(this, query);
  }
}
