import { Criteria } from '@lib-commons/domain/criteria/criteria';
import { ListEcosystem } from '@module-eco/domain/list-ecosystem';
import { Ecosystem } from '@module-eco/domain/aggregate/ecosystem';
import { IPaginationOrder } from '@lib-commons/domain/list/pagination-order-filter';

export interface IEcosystemRepository {
  persist(model: Ecosystem): Promise<void>;
  byNameOrFail(name: string): Promise<Ecosystem>;
  byIdOrFail(id: string, withDeleted: boolean): Promise<Ecosystem>;
  isNameAvailable(name: string): Promise<boolean>;
  list(): Promise<ListEcosystem>;
  list(options: IPaginationOrder): Promise<ListEcosystem>;
  matching(criteria: Criteria): Promise<ListEcosystem>;
}
