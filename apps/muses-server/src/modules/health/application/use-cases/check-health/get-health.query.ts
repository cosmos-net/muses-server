import { IQuery } from '@management-commons/domain/contracts/query';

export class GetHealthQuery implements IQuery {
  url: string;

  name: string;

  constructor(query: Partial<GetHealthQuery>) {
    Object.assign(this, query);
  }
}
