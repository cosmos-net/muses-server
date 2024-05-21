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
import { ActionPropertyWithSameValueException } from '@module-action/domain/exceptions/action-property-with-same-value.exception';
import { ActionAlreadyEnabledException } from '@module-action/domain/exceptions/action-already-enabled.exception';
import { removePropertyFromObject } from '@core/domain/helpers/utils';

export class Action {
  private _entityRoot = {} as IActionSchemaAggregate;

  constructor(schema?: IActionSchema | Partial<IActionSchema> | string | null) {
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

  get subModules(): (ISubModuleSchema | string)[] | undefined {
    if (!this._entityRoot.subModules) return undefined;

    return this._entityRoot.subModules.map((subModule) => {
      if (typeof subModule === 'object') {
        return subModule.toPrimitives();
      }

      return subModule;
    });
  }

  get modules(): (IModuleSchema | string)[] | undefined {
    if (!this._entityRoot.modules) return undefined;

    return this._entityRoot.modules.map((module) => {
      if (typeof module === 'object') {
        return module.toPrimitives();
      }

      return module;
    });
  }

  get modulesIds(): string[] {
    if (!this._entityRoot.modules) return [];

    return this._entityRoot.modules.map((module) => {
      if (typeof module === 'object') {
        return module.id;
      }

      return module;
    });
  }

  get subModulesIds(): string[] {
    if (!this._entityRoot.subModules) return [];

    return this._entityRoot.subModules.map((subModule) => {
      if (typeof subModule === 'object') {
        return subModule.id;
      }

      return subModule;
    });
  }

  get resource() {
    return this._entityRoot.resource;
  }

  public describe(name: string, description: string): void {
    this._entityRoot.name = new Name(name);
    this._entityRoot.description = new Description(description);
  }

  public enable(): void {
    if (this._entityRoot.isEnabled.value === true) {
      throw new ActionAlreadyEnabledException();
    }

    this._entityRoot.isEnabled = new IsEnabled(true);
    this._entityRoot.deletedAt = undefined;
  }

  public disable(): void {
    if (this._entityRoot.isEnabled.value === false) {
      throw new ActionPropertyWithSameValueException('isEnabled', false);
    }

    this._entityRoot.isEnabled = new IsEnabled(false);
    this._entityRoot.deletedAt = new DeletedAt(new Date());
  }

  public restore(): void {
    const isCurrentlyDisabled =
      this._entityRoot.deletedAt instanceof DeletedAt && this._entityRoot.isEnabled.value === false;

    if (isCurrentlyDisabled) {
      delete this._entityRoot.deletedAt;
      this._entityRoot.isEnabled = new IsEnabled(true);
    }
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

  private hydrateModules(modules?: string[]): void {
    if (modules === undefined || modules === null || modules.length === 0) return;

    if (!this._entityRoot.modules) {
      this._entityRoot.modules = [];

      for (const module of modules) {
        this._entityRoot.modules.push(module);
      }
    } else {
      for (const module of modules) {
        const isAlreadyModuleUsed = this._entityRoot.modules.some((moduleUsed) => {
          if (typeof moduleUsed === 'object') {
            return moduleUsed.id === module;
          }

          return moduleUsed === module;
        });

        if (!isAlreadyModuleUsed) {
          this._entityRoot.modules.push(module);
        }
      }
    }
  }

  private hydrateSubModules(subModules?: string[]): void {
    if (subModules === undefined || subModules === null || subModules.length === 0) return;

    if (!this._entityRoot.subModules) {
      this._entityRoot.subModules = [];

      for (const subModule of subModules) {
        this._entityRoot.subModules.push(subModule);
      }
    } else {
      for (const subModule of subModules) {
        const isAlreadySubModuleUsed = this._entityRoot.subModules.find((subModuleUsed) => {
          if (typeof subModuleUsed === 'object') {
            return subModuleUsed.id === subModule;
          }

          return subModuleUsed === subModule;
        });

        if (!isAlreadySubModuleUsed) {
          this._entityRoot.subModules.push(subModule);
        }
      }
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

    if (schema.resource) this._entityRoot.resource = schema.resource;

    this.hydrateModules(schema.modules);
    this.hydrateSubModules(schema.subModules);
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
      resource: this.resource,
    };
  }

  public fromPrimitives(schema: IActionSchema): void {
    this.hydrate(schema);
  }

  public entityRootPartial(): Partial<IActionSchema> {
    const partialSchema: Partial<IActionSchema> = {};
    for (const [key, value] of Object.entries(this._entityRoot)) {
      if (value instanceof Object) {
        if (value.value !== null && value.value !== undefined) {
          partialSchema[key] = value.value;
        } else if (Array.isArray(value)) {
          if (key === 'subModules') {
            partialSchema[key] = value.map((subModule) => (typeof subModule === 'object' ? subModule.id : subModule));
          } else if (key === 'modules') {
            partialSchema[key] = value.map((module) => (typeof module === 'object' ? module.id : module));
          }
        }
      } else {
        partialSchema[key] = value;
      }
    }

    return partialSchema;
  }

  public useModules(modules: Module[]): void {
    this._entityRoot.modules = [];

    for (const module of modules) {
      this._entityRoot.modules.push(module);
    }
  }

  public useSubModules(subModules: SubModule[]): void {
    this._entityRoot.subModules = [];

    for (const subModule of subModules) {
      this._entityRoot.subModules.push(subModule);
    }
  }

  public useModulesAndReturnModulesLegacy(modules: IModuleSchema[]): string[] {
    if (this._entityRoot.modules === undefined) {
      this._entityRoot.modules = [];

      for (const module of modules) {
        this._entityRoot.modules.push(new Module(module));
      }

      return [];
    }

    const currentModules = this._entityRoot.modules;

    const modulesToAdd = modules.filter((module) => {
      for (const currentModule of currentModules) {
        return currentModule !== module.id;
      }
    });

    const modulesToRemove = this._entityRoot.modules.filter((module) => {
      if (typeof module === 'object') {
        return !modules.map((module) => module.id).includes(module.id);
      } else {
        return !modules.map((module) => module.id).includes(module);
      }
    });

    if (modulesToAdd.length === 0 && modulesToRemove.length === 0) {
      throw new ActionPropertyWithSameValueException(
        'modules',
        this._entityRoot.modules.map((module) => (typeof module === 'object' ? module.id : module)),
      );
    }

    for (const module of modulesToAdd) {
      this._entityRoot.modules.push(new Module(module));
    }

    return modulesToRemove.map((module) => (typeof module === 'object' ? module.id : module));
  }

  public useSubModulesAndReturnSubModulesLegacy(subModules: ISubModuleSchema[]): string[] {
    if (this._entityRoot.subModules === undefined) {
      this._entityRoot.subModules = [];

      for (const subModule of subModules) {
        this._entityRoot.subModules.push(new SubModule(subModule));
      }

      return [];
    }

    const currentSubModules = this._entityRoot.subModules;

    const subModulesToAdd = subModules.filter((subModule) => {
      for (const currentSubModule of currentSubModules) {
        return currentSubModule !== subModule.id;
      }
    });

    const subModulesToRemove = this._entityRoot.subModules.filter(
      (subModule) => !subModules.map((subModule) => subModule.id).includes(subModule),
    );

    if (subModulesToAdd.length === 0 && subModulesToRemove.length === 0) {
      throw new ActionPropertyWithSameValueException(
        'subModules',
        this._entityRoot.subModules.map((subModule) => (typeof subModule === 'object' ? subModule.id : subModule)),
      );
    }

    for (const subModule of subModulesToAdd) {
      this._entityRoot.subModules.push(new SubModule(subModule));
    }

    return subModulesToRemove.map((subModule) => (typeof subModule === 'object' ? subModule.id : subModule));
  }

  public addResource(resourceId: string): void {
    this._entityRoot.resource = resourceId;
  }

  public removeResource(resourceId): void {
    if (this._entityRoot.resource !== resourceId) {
      throw new Error(`The resource ${resourceId} is not related to this action ${this._entityRoot.id}`);
    }

    this._entityRoot.resource = null;
  }

  public removeModules(): void {
    this._entityRoot = removePropertyFromObject<IActionSchemaAggregate, 'modules'>(this._entityRoot, 'modules');
  }

  public removeSubModules(): void {
    this._entityRoot = removePropertyFromObject<IActionSchemaAggregate, 'subModules'>(this._entityRoot, 'subModules');
  }
}
