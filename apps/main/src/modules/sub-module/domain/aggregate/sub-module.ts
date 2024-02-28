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

export class SubModule {
  private _entityRoot = {} as ISubModuleSchemaAggregate;

  constructor(schema?: ISubModuleSchema | null) {
    if (schema instanceof Object) {
      this.hydrate(schema);
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

  get module(): IModuleSchema {
    return this._entityRoot.module.toPrimitives();
  }

  enable(): void {
    this._entityRoot.isEnabled = new IsEnabled(true);
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
        this._entityRoot.module = new Module(schema.module);
      }
    } else if (this._entityRoot.module === undefined && schema.module instanceof Object) {
      this._entityRoot.module = new Module(schema.module);
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
      console.log(value)
      if (value instanceof Object) {
        if (value.value !== null) {
          partialSchema[key] = value.value;
        }
      }
    }

    return partialSchema;
  }

  public describe(name: string, description: string): void {
    this._entityRoot.name = new Name(name);
    this._entityRoot.description = new Description(description);
  }

  public disable(): void {
    if (this._entityRoot.isEnabled.value === false) {
      throw new Error('SubModule already disabled');
    }

    this._entityRoot.isEnabled = new IsEnabled(false);
    this._entityRoot.deletedAt = new DeletedAt(new Date());
  }
}
