import { IQuery } from '@management-commons/domain/contracts/query';

export interface IApplicationServiceQuery<QueryBase extends IQuery = IQuery> {
  process<T extends QueryBase>(query: T): Promise<any>;
}
