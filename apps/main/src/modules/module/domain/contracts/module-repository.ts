import { Criteria } from '@lib-commons/domain/criteria/criteria';
import { Module } from '@module-module/domain/aggregate/module';
import { ListModule } from '@module-module/domain/list-module';
export interface IModuleRepository {
  persist(model: Module);
  isNameAvailable(name: string): Promise<boolean>;
  delete(id: string): Promise<void>;
  searchOneBy(
    id: string,
    options?: {
      withDeleted: boolean;
    },
  ): Promise<Module | null>;
  searchListBy(criteria: Criteria): Promise<ListModule>;
  getListByIds(ids: string[]): Promise<ListModule>;
}
