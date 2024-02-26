import { SubModule } from '@module-sub-module/domain/aggregate/sub-module';

export interface ISubModuleRepository {
  searchOneBy(id: string, options: { withDeleted: boolean }): Promise<SubModule | null>;
}
