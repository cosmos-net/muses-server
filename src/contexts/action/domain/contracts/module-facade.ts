import { ListModule } from '@module-module/domain/list-module';

export interface IModuleFacade {
  getModuleByIds(id: string[]): Promise<ListModule>;
}
