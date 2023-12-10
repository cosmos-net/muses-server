import { IQuery } from '@management-commons/domain/contracts/presentation/query';

export interface IApplicationServiceQuery<QueryBase extends IQuery = IQuery> {
  process<T extends QueryBase>(query: T): Promise<unknown> | void;
}
