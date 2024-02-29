import { Module } from '@module-module/domain/aggregate/module';

export interface IModuleFacade {
  getModuleById(id: string): Promise<Module>;
}
