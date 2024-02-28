import { SubModule } from '@module-sub-module/domain/aggregate/sub-module';

export interface ISubModuleModuleFacade {
  getSubModuleBy(id: string): Promise<SubModule>;
}
