import { Module } from '@module-module/domain/aggregate/module';

export interface ISubModuleModuleFacade {
  getModuleById(id: string): Promise<Module>;
}
