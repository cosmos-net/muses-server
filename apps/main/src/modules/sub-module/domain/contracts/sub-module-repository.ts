import { SubModule } from '@module-sub-module/domain/aggregate/sub-module';

export interface ISubModuleRepository {
  searchOneBy(id: string, options: { withDeleted: boolean }): Promise<SubModule | null>;
  isNameAvailable(name: string): Promise<boolean>;
  persist(subModule: SubModule);
  delete(id: string): Promise<void>;
}
