import { IPaginationOrder } from '@lib-commons/domain';
import { Ecosystem, ListEcosystem } from '@module-eco/domain';

export interface IEcosystemRepository {
  persist(model: Ecosystem): Promise<void>;
  byNameOrFail(name: string): Promise<Ecosystem>;
  byIdOrFail(id: string): Promise<Ecosystem>;
  list(): Promise<ListEcosystem>;
  list(options: IPaginationOrder): Promise<ListEcosystem>;
  softDeleteBy(id: string): Promise<number | undefined>;
}
