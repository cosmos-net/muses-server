import { Module } from '@module-module/domain/aggregate/module';

export interface IModuleModuleFacadeService {
  getModuleById(id: string): Promise<Module>;
}
