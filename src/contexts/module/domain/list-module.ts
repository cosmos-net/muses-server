import { Module } from '@module-module/domain/aggregate/module';
import { IModuleSchema } from '@module-module/domain/aggregate/module.schema';

export class ListModule {
  private modules: Module[];
  private total: number;

  constructor(moduleSchema: IModuleSchema[], total: number) {
    this.modules = moduleSchema.map((moduleSchema) => new Module(moduleSchema));
    this.setTotal(total);
  }

  public setTotal(total: number) {
    this.total = total;
  }

  public hydrate(module: any[]): void {
    this.modules = [...module];
    this.setTotal(module.length);
  }

  public add(entity: Module): void {
    this.modules.push(entity);
  }

  public entities(): Module[] {
    return this.modules;
  }

  public get totalItems(): number {
    return this.total;
  }

  public get items(): Module[] {
    return this.modules;
  }
}
