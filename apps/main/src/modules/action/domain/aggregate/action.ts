import { IActionSchemaAggregate } from '@module-action/domain/aggregate/action.aggregate';
import { IActionSchema } from '@module-action/domain/aggregate/action.schema';
import { IModuleSchema } from '@module-module/domain/aggregate/module.schema';
import { ISubModuleSchema } from '@module-sub-module/domain/aggregate/sub-module.schema';
import Id from '@module-action/domain/aggregate/value-objects/id.vo';
import Name from '@module-action/domain/aggregate/value-objects/name.vo';
import Description from '@module-action/domain/aggregate/value-objects/description.vo';
import IsEnabled from '@module-action/domain/aggregate/value-objects/is-enabled.vo';
import CreatedAt from '@module-action/domain/aggregate/value-objects/created-at.vo';
import DeletedAt from '@module-action/domain/aggregate/value-objects/deleted-at.vo';
import UpdatedAt from '@module-action/domain/aggregate/value-objects/updated-at.vo';
import { Module } from '@module-module/domain/aggregate/module';
import { SubModule } from '@module-sub-module/domain/aggregate/sub-module';
import { ActionPropertyWithSameValueException } from '../exceptions/action-property-with-same-value.exception';

export class Action {
  private _entityRoot = {} as IActionSchemaAggregate;

  constructor(schema?: IActionSchema | Partial<IActionSchema> | string | null) {
    if (!this._entityRoot.subModules?.length) this._entityRoot.subModules = [];
    if (!this._entityRoot.modules?.length) this._entityRoot.modules = [];

    if (schema) {
      let isPartialSchema: boolean = false;
      if (typeof schema !== 'string' && Object.keys(schema).length === 2) {
        isPartialSchema = true;
      }

      if (typeof schema === 'string') {
        this._entityRoot.id = new Id(schema);
        this._entityRoot.isEnabled = new IsEnabled(true);
      } else if (!isPartialSchema) {
        this.hydrate(schema as IActionSchema);
      } else if (isPartialSchema) {
        if (Object.keys(schema).length === 2) {
          if (schema.id) this._entityRoot.id = new Id(schema.id);
          if (schema.isEnabled) this._entityRoot.isEnabled = new IsEnabled(schema.isEnabled);
        }
      }
    } else {
      this._entityRoot.isEnabled = new IsEnabled(true);
    }
  }

  get id(): string {
    return this._entityRoot.id.value;
  }

  get name(): string {
    return this._entityRoot.name.value;
  }

  get description(): string {
    return this._entityRoot.description.value;
  }

  get isEnabled(): boolean {
    return this._entityRoot.isEnabled.value;
  }

  get createdAt(): Date {
    return this._entityRoot.createdAt.value;
  }

  get updatedAt(): Date {
    return this._entityRoot.updatedAt.value;
  }

  get deletedAt(): Date | undefined {
    return this._entityRoot.deletedAt?.value;
  }

  get subModules(): ISubModuleSchema[] | string[] {
    return this._entityRoot.subModules;
  }

  get modules(): IModuleSchema[] | string[] {
    return this._entityRoot.modules;
  }

  public describe(name: string, description: string): void {
    this._entityRoot.name = new Name(name);
    this._entityRoot.description = new Description(description);
  }

  public enable(): void {
    this._entityRoot.isEnabled = new IsEnabled(true);
  }

  public redescribe(name?: string, description?: string): void {
    if (name) {
      if (this._entityRoot.name.value === name) {
        throw new ActionPropertyWithSameValueException('name', name);
      }

      this._entityRoot.name = new Name(name);
    }

    if (description) {
      if (this._entityRoot.description.value === description) {
        throw new ActionPropertyWithSameValueException('description', description);
      }

      this._entityRoot.description = new Description(description);
    }
  }

  public changeStatus(isEnabled?: boolean): void {
    if (isEnabled !== undefined) {
      if (this._entityRoot.isEnabled.value === isEnabled) {
        throw new ActionPropertyWithSameValueException('isEnabled', isEnabled);
      }

      this._entityRoot.isEnabled = new IsEnabled(isEnabled);
    }
  }

  public hydrate(schema: IActionSchema): void {
    this._entityRoot.id = new Id(schema.id);
    this._entityRoot.name = new Name(schema.name);
    this._entityRoot.description = new Description(schema.description);
    this._entityRoot.isEnabled = new IsEnabled(schema.isEnabled);
    this._entityRoot.createdAt = new CreatedAt(schema.createdAt);
    this._entityRoot.updatedAt = new UpdatedAt(schema.updatedAt);

    if (schema.deletedAt && !this._entityRoot.deletedAt) {
      this._entityRoot.deletedAt = new DeletedAt(schema.deletedAt);
    }

    if (schema.subModules) {
      for (const subModule of schema.subModules) {
        if (typeof subModule === 'string') {
          this._entityRoot.subModules.push(subModule);
        } else if (subModule instanceof SubModule) {
          this._entityRoot.subModules.push(new SubModule(subModule));
        }
      }
    }

    if (schema.modules) {
      for (const module of schema.modules) {
        if (typeof module === 'string') {
          this._entityRoot.modules.push(module);
        } else if (module instanceof Module) {
          this._entityRoot.modules.push(new Module(module));
        }
      }
    }
  }

  public toPrimitives(): IActionSchema {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      isEnabled: this.isEnabled,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      modules: this.modules,
      subModules: this.subModules,
    };
  }

  public fromPrimitives(schema: IActionSchema): void {
    this.hydrate(schema);
  }

  public entityRootPartial(): Partial<IActionSchema> {
    const partialSchema: Partial<IModuleSchema> = {};
    for (const [key, value] of Object.entries(this._entityRoot)) {
      if (value instanceof Object) {
        if (value.value !== null) {
          if (key === 'subModules') {
            partialSchema[key] = value.map((subModule) => subModule.id);
            continue;
          }

          if (key === 'modules') {
            partialSchema[key] = value.map((module) => module.id);
            continue;
          }

          partialSchema[key] = value.value;
        }
      }
    }

    return partialSchema;
  }

  public useModules(modules: IModuleSchema[] | string[]): void {
    for (const module of modules) {
      this._entityRoot.modules.push(new Module(module));
    }
  }

  public useSubModules(subModules: ISubModuleSchema[] | string[]): void {
    for (const subModule of subModules) {
      this._entityRoot.subModules.push(new SubModule(subModule));
    }
  }

  public useModulesAndReturnModulesLegacy(modules: IModuleSchema[]): IModuleSchema[] {
    const modulesToAdd = modules.filter((module) => !this._entityRoot.modules.includes(module.id));

    const modulesToRemove = this._entityRoot.modules.filter(
      (module) => !modules.map((module) => module.id).includes(module),
    );

    if (modulesToAdd.length === 0 && modulesToRemove.length === 0) {
      throw new ActionPropertyWithSameValueException('modules', this._entityRoot.modules);
    }

    this._entityRoot.modules = [];

    for (const module of modulesToAdd) {
      this._entityRoot.modules.push(new Module(module));
    }

    return modulesToRemove;
  }

  public useSubModulesAndReturnSubModulesLegacy(subModules: ISubModuleSchema[]): ISubModuleSchema[] {
    const subModulesToAdd = subModules.filter((subModule) => !this._entityRoot.subModules.includes(subModule.id));

    const subModulesToRemove = this._entityRoot.subModules.filter(
      (subModule) => !subModules.map((subModule) => subModule.id).includes(subModule),
    );

    if (subModulesToAdd.length === 0 && subModulesToRemove.length === 0) {
      throw new ActionPropertyWithSameValueException('subModules', this._entityRoot.subModules);
    }

    this._entityRoot.subModules = [];

    for (const subModule of subModulesToAdd) {
      this._entityRoot.subModules.push(new SubModule(subModule));
    }

    return subModulesToRemove;
  }

  public useModules(modules: IModuleSchema[]): void {
    for (const module of modules) {
      this._entityRoot.modules.push(new Module(module));
    }
  }

  public useSubModules(subModules: ISubModuleSchema[]): void {
    for (const subModule of subModules) {
      this._entityRoot.subModules.push(new SubModule(subModule));
    }
  }
}
