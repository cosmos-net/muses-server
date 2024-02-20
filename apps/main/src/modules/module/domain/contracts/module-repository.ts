import { Module } from '@module-module/domain/aggregate/module';
export interface IModuleRepository {
  persist(model: Module);
  isNameAvailable(name: string): Promise<boolean>;
  searchOneBy(
    id: string,
    options?: {
      withDeleted: boolean;
    },
  ): Promise<Module | null>;
}
