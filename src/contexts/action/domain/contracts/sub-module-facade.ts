import { ListSubModule } from '@module-sub-module/domain/aggregate/list-sub-module';

export interface ISubModuleFacade {
  getSubModuleByIds(id: string[]): Promise<ListSubModule>;
}
