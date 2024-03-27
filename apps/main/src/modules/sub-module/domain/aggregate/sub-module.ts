import { ISubModuleSchemaAggregate } from '@module-sub-module/domain/aggregate/sub-module.aggregate';
import { ISubModuleSchema } from '@module-sub-module/domain/aggregate/sub-module.schema';
import { IModuleSchema } from '@module-module/domain/aggregate/module.schema';
import Id from '@module-sub-module/domain/aggregate/value-objects/id.vo';
import Name from '@module-sub-module/domain/aggregate/value-objects/name.vo';
import Description from '@module-sub-module/domain/aggregate/value-objects/description.vo';
import IsEnabled from '@module-sub-module/domain/aggregate/value-objects/is-enabled.vo';
import CreatedAt from '@module-sub-module/domain/aggregate/value-objects/created-at.vo';
import DeletedAt from '@module-sub-module/domain/aggregate/value-objects/deleted-at.vo';
import UpdatedAt from '@module-sub-module/domain/aggregate/value-objects/updated-at.vo';
import { Module } from '@module-module/domain/aggregate/module';
import { SubModuleIsAlreadyDisabledUsedException } from '@module-sub-module/domain/exceptions/sub-module-is-already-disabled.exception';
import { SubModulePropertyWithSameValueException } from '@module-sub-module/domain/exceptions/sub-module-property-with-same-value.exception';

export class SubModule {
  private _entityRoot = {} as ISubModuleSchemaAggregate;

  constructor(schema?: ISubModuleSchema | string | null) {
    if (schema instanceof Object) {
      this.hydrate(schema);
    } else if (typeof schema === 'string') {
      this._entityRoot.id = new Id(schema);
      this._entityRoot.isEnabled = new IsEnabled(true);
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

  get moduleId(): string {
    if (typeof this._entityRoot.module === 'string') {
      return this._entityRoot.module;
    }

    return this._entityRoot.module.id;
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
    if (this._entityRoot.module instanceof Module) {
      return this._entityRoot.module.toPrimitives();
    }

    return this._entityRoot.module;
  }

  get actions(): string[] {
    return this._entityRoot.actions;
  }

  public describe(name: string, description: string): void {
    this._entityRoot.name = new Name(name);
    this._entityRoot.description = new Description(description);
  }

  public enable(): void {
    this._entityRoot.isEnabled = new IsEnabled(true);
  }

  public disable(): void {
    if (this._entityRoot.isEnabled.value === false) {
      throw new SubModuleIsAlreadyDisabledUsedException();
    }

    this._entityRoot.isEnabled = new IsEnabled(false);
    this._entityRoot.deletedAt = new DeletedAt(new Date());
  }

  public restore(): void {
    const isCurrentlyDeleted =
      this._entityRoot.deletedAt instanceof DeletedAt && this._entityRoot.isEnabled.value === false;

    if (isCurrentlyDeleted) {
      delete this._entityRoot.deletedAt;
      this._entityRoot.isEnabled = new IsEnabled(true);
    }
  }

  public clone(): SubModule {
    return new SubModule(this.toPrimitives());
  }

  public hydrate(schema: ISubModuleSchema): void {
    this._entityRoot.id = new Id(schema.id);
    this._entityRoot.name = new Name(schema.name);
    this._entityRoot.description = new Description(schema.description);
    this._entityRoot.isEnabled = new IsEnabled(schema.isEnabled);
    this._entityRoot.createdAt = new CreatedAt(schema.createdAt);
    this._entityRoot.updatedAt = new UpdatedAt(schema.updatedAt);

    if (schema.deletedAt && !this._entityRoot.deletedAt) {
      this._entityRoot.deletedAt = new DeletedAt(schema.deletedAt);
    }

    if (typeof schema.module === 'string') {
      if (this._entityRoot.module instanceof Module) {
        this._entityRoot.module.id = schema.module;
      } else if (this._entityRoot.module === undefined) {
        this._entityRoot.module = schema.module;
      }
    } else if (this._entityRoot.module === undefined && schema.module instanceof Object) {
      this._entityRoot.module = new Module(schema.module);
    }

    if (Array.isArray(schema.actions)) {
      this._entityRoot.actions = schema.actions;
    }
  }

  public useModule(module: IModuleSchema): void {
    this._entityRoot.module = new Module(module);
  }

  public toPrimitives(): ISubModuleSchema {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      isEnabled: this.isEnabled,
      actions: this.actions,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      module: this.module,
    };
  }

  public fromPrimitives(schema: ISubModuleSchema): void {
    this.hydrate(schema);
  }

  public entityRootPartial(): Partial<ISubModuleSchema> {
    const partialSchema: Partial<IModuleSchema> = {};
    for (const [key, value] of Object.entries(this._entityRoot)) {
      if (value instanceof Object) {
        if (value.value !== null) {
          partialSchema[key] = value.value;
        }

        if (key === 'module') {
          partialSchema[key] = value;
        }

        if (key === 'actions') {
          partialSchema[key] = value;
        }
      }
    }

    return partialSchema;
  }

  public redescribe(name?: string, description?: string): void {
    if (name) {
      if (this._entityRoot.name.value === name) {
        throw new SubModulePropertyWithSameValueException('name', name);
      }

      this._entityRoot.name = new Name(name);
    }

    if (description) {
      if (this._entityRoot.description.value === description) {
        throw new SubModulePropertyWithSameValueException('description', description);
      }

      this._entityRoot.description = new Description(description);
    }
  }

  public changeStatus(isEnabled: boolean): void {
    if (isEnabled !== undefined) {
      if (this._entityRoot.isEnabled.value === isEnabled) {
        throw new SubModulePropertyWithSameValueException('isEnabled', isEnabled);
      }

      this._entityRoot.isEnabled = new IsEnabled(isEnabled);
    }
  }

  public removeAction(actionId: string): void {
    if (this._entityRoot.actions && this._entityRoot.actions.length > 0) {
      const actionIndex = this._entityRoot.actions.findIndex((action) => action === actionId);

      if (actionIndex === -1) {
        throw new Error('Action not found');
      }

      this._entityRoot.actions.splice(actionIndex, 1);
    }
  }

  public addAction(actionId: string): void {
    if (this._entityRoot.actions && this._entityRoot.actions.length > 0) {
      const isActionAlreadyAdded = this._entityRoot.actions.find((action) => action === actionId);

      if (isActionAlreadyAdded) {
        throw new Error('Action already added');
      }

      return;
    }

    this._entityRoot.actions = [];
    this._entityRoot.actions.push(actionId);
  }
}
