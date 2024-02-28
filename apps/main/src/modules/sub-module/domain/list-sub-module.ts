import { SubModule } from '@module-sub-module/domain/aggregate/sub-module';
import { ISubModuleSchema } from '@module-sub-module/domain/aggregate/sub-module.schema';

export class ListSubModule {
  private subModules: SubModule[];
  private total: number;

  constructor(subModuleSchema: ISubModuleSchema[], total: number) {
    this.subModules = subModuleSchema.map((subModuleSchema) => new SubModule(subModuleSchema));
    this.setTotal(total);
  }

  public setTotal(total: number) {
    this.total = total;
  }

  public hydrate(module: any[]): void {
    this.subModules = [...module];
    this.setTotal(module.length);
  }

  public add(entity: SubModule): void {
    this.subModules.push(entity);
  }

  public entities(): SubModule[] {
    return this.subModules;
  }

  public get totalItems(): number {
    return this.total;
  }

  public get items(): SubModule[] {
    return this.subModules;
  }
}
