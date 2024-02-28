import { Criteria } from '@lib-commons/domain/criteria/criteria';
import { SubModule } from '@module-sub-module/domain/aggregate/sub-module';
import { ListSubModule } from '@module-sub-module/domain/list-sub-module';


export interface ISubModuleRepository {
  searchOneBy(id: string, options: { withDeleted: boolean }): Promise<SubModule | null>;
  isNameAvailable(name: string): Promise<boolean>;
  persist(subModule: SubModule);
  delete(id: string): Promise<void>;
  searchListBy(criteria: Criteria): Promise<ListSubModule>;
}
