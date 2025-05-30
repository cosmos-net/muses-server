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
import { ActionCatalog, IActionCatalogSchema } from '@module-action/domain/aggregate/action-catalog';

export class Action {
  private readonly _entityRoot = {} as IActionSchemaAggregate;

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

  get module(): IModuleSchema | string {
    if (typeof this._entityRoot.module === 'object') {
      return this._entityRoot.module.toPrimitives();
    }

    return this._entityRoot.module;
  }

  get moduleId(): string {
    if (typeof this._entityRoot.module === 'object') {
      return this._entityRoot.module.id;
    }

    return this._entityRoot.module;
  }

  get submodule(): ISubModuleSchema | string | undefined {
    if (typeof this._entityRoot.submodule === 'object') {
      return this._entityRoot.submodule?.toPrimitives();
    }

    return this._entityRoot.submodule;
  }

  get submoduleId(): string | undefined {
    if (typeof this._entityRoot.submodule === 'object') {
      return this._entityRoot.submodule?.id;
    }

    return this._entityRoot.submodule;
  }

  get resource() {
    return this._entityRoot.resource;
  }

  get actionCatalog(): IActionCatalogSchema | string {
    if (typeof this._entityRoot.actionCatalog === 'object') {
      return this._entityRoot.actionCatalog.toPrimitives();
    }

    return this._entityRoot.actionCatalog;
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



  public hydrate(schema: IActionSchema): void {
    this._entityRoot.id = new Id(schema.id);
    this._entityRoot.name = new Name(schema.name);
    this._entityRoot.description = new Description(schema.description);
    this._entityRoot.isEnabled = new IsEnabled(schema.isEnabled);
    this._entityRoot.createdAt = new CreatedAt(schema.createdAt);
    this._entityRoot.updatedAt = new UpdatedAt(schema.updatedAt);

    this._entityRoot.module = schema.module;
    if (schema.submodule) this._entityRoot.submodule = schema.submodule;
    if (schema.resource) this._entityRoot.resource = schema.resource;
    

    if (!this._entityRoot.actionCatalog) {
      this._entityRoot.actionCatalog = schema.actionCatalog;
    }

    if (schema.deletedAt && !this._entityRoot.deletedAt) {
      this._entityRoot.deletedAt = new DeletedAt(schema.deletedAt);
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
      module: this.module,
      submodule: this.submodule,
      resource: this.resource,
      actionCatalog: this.actionCatalog,
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
        } else if (value instanceof Object) {
          partialSchema[key] = value.id;
        }
      } else {
        partialSchema[key] = value;
      }
    }

    return partialSchema;
  }

  public useModule(modules: Module): void {
    this._entityRoot.module = modules;
  }

  public useSubmodule(submodule: SubModule): void {
    const currentModule = this._entityRoot.module;

    if (currentModule instanceof Module) {
      const currentSubmodules = currentModule.subModules;

      const isSubmoduleOfModule: boolean = currentSubmodules.some((currentSubmodule: SubModule | string): boolean => {
        if (typeof currentSubmodule === 'object') {
          return currentSubmodule.id === submodule.id;
        }

        if (typeof currentSubmodule === 'string') {
          return currentSubmodule === submodule.id;
        }

        return false;
      });
    
      if (!isSubmoduleOfModule) {
        throw new Error(`The submodule ${submodule.id} is not related to the module ${currentModule.id}`);
      }
    }

    this._entityRoot.updatedAt = new UpdatedAt(new Date());
    this._entityRoot.submodule = submodule;
  
  }

  public replaceModule(module: Module): void {
    if (this.moduleId === module.id) {
      throw new ActionPropertyWithSameValueException('module', module.id);
    }

    this._entityRoot.module = module;
  }

  public replaceSubmodule(submodule: SubModule): void {
    if (this.submoduleId === submodule.id) {
      throw new ActionPropertyWithSameValueException('submodule', submodule.id);
    }

    this._entityRoot.submodule = submodule;
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

  public removeSubModule(): void {
    this._entityRoot.submodule = null;
  }

  public categorize(actionCatalog: ActionCatalog): void {
    this._entityRoot.actionCatalog = actionCatalog;
  }
}
