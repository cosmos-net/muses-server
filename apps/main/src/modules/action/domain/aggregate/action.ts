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

  get subModules(): ISubModuleSchema[] {
    return this._entityRoot.subModules;
  }

  get modules(): IModuleSchema[] {
    return this._entityRoot.modules;
  }

  public enable(): void {
    this._entityRoot.isEnabled = new IsEnabled(true);
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
}
