import { IQuery } from '@lib-commons/domain';

export interface IApplicationServiceQuery<QueryBase extends IQuery = IQuery> {
  process<T extends QueryBase>(query: T): Promise<unknown> | Promise<void> | void;
}
