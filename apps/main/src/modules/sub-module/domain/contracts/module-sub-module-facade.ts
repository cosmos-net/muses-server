import { Module } from '@module-module/domain/aggregate/module';

export interface IModuleModuleFacade {
  getModuleById(id: string): Promise<Module>;
}
