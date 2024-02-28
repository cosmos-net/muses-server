import Id from '@module-module/domain/aggregate/value-objects/id.vo';
import Name from '@module-module/domain/aggregate/value-objects/name.vo';
import Description from '@module-module/domain/aggregate/value-objects/description.vo';
import CreatedAt from '@module-module/domain/aggregate/value-objects/created-at.vo';
import DeletedAt from '@module-module/domain/aggregate/value-objects/deleted-at.vo';
import UpdatedAt from '@module-module/domain/aggregate/value-objects/updated-at.vo';
import IsEnabled from '@module-module/domain/aggregate/value-objects/is-enabled.vo';
import Project, { IProject } from '@module-module/domain/aggregate/value-objects/project.vo';
import { ModuleIsAlreadyDisabledUsedException } from '@module-module/domain/exceptions/module-is-already-disabled.exception';
import { IModuleSchemaAggregate } from '@module-module/domain/aggregate/module.schema.vo';
import { IModuleSchema } from '@module-module/domain/aggregate/module.schema';
import { ModulePropertyWithSameValue } from '@module-module/domain/exceptions/module-property-with-same-value.exception';

export class Module {
  private _entityRoot = {} as IModuleSchemaAggregate;

  constructor(schema?: IModuleSchema | string | null) {
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

  get projectId(): string {
    return this._entityRoot.project.id;
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

  get project(): IProject {
    return this._entityRoot.project.toPrimitives();
  }

  set id(id: string) {
    this._entityRoot.id = new Id(id);
  }

  enable(): void {
    this._entityRoot.isEnabled = new IsEnabled(true);
  }

  disable(): void {
    if (this._entityRoot.isEnabled.value === false) {
      throw new ModuleIsAlreadyDisabledUsedException();
    }

    this._entityRoot.isEnabled = new IsEnabled(false);
    this._entityRoot.deletedAt = new DeletedAt(new Date());
  }

  public hydrate(schema: IModuleSchema): void {
    this._entityRoot.id = new Id(schema.id);
    this._entityRoot.name = new Name(schema.name);
    this._entityRoot.description = new Description(schema.description);
    this._entityRoot.isEnabled = new IsEnabled(schema.isEnabled);
    this._entityRoot.createdAt = new CreatedAt(schema.createdAt);
    this._entityRoot.updatedAt = new UpdatedAt(schema.updatedAt);

    if (schema.deletedAt && !this._entityRoot.deletedAt) {
      this._entityRoot.deletedAt = new DeletedAt(schema.deletedAt);
    }

    if (typeof schema.project === 'string') {
      if (this._entityRoot.project instanceof Project) {
        this._entityRoot.project.id = schema.project;
      } else if (this._entityRoot.project === undefined) {
        this._entityRoot.project = new Project(schema.project);
      }
    } else if (this._entityRoot.project === undefined && schema.project instanceof Object) {
      this._entityRoot.project = new Project(schema.project);
    }
  }

  public describe(name: string, description: string): void {
    this._entityRoot.name = new Name(name);
    this._entityRoot.description = new Description(description);
  }

  public useProject(project: IProject): void {
    this._entityRoot.project = new Project(project);
  }

  public toPrimitives(): IModuleSchema {
    return {
      id: this._entityRoot.id.value,
      name: this._entityRoot.name.value,
      description: this._entityRoot.description.value,
      project: this._entityRoot.project.toPrimitives(),
      isEnabled: this._entityRoot.isEnabled.value,
      createdAt: this._entityRoot.createdAt.value,
      updatedAt: this._entityRoot.updatedAt.value,
      deletedAt: this._entityRoot.deletedAt?.value,
    };
  }

  public fromPrimitives(schema: IModuleSchema): void {
    this.hydrate(schema);
  }

  public entityRootPartial(): Partial<IModuleSchema> {
    const partialSchema: Partial<IModuleSchema> = {};
    for (const [key, value] of Object.entries(this._entityRoot)) {
      if (value instanceof Object) {
        if (value.value !== null) {
          partialSchema[key] = value.value;
        }
      }
    }

    return partialSchema;
  }

  public redescribe(name?: string, description?: string): void {
    if (name) {
      if (this._entityRoot.description.value === name) {
        throw new ModulePropertyWithSameValue('name', name);
      }

      this._entityRoot.name = new Name(name);
    }

    if (description) {
      if (this._entityRoot.description.value === description) {
        throw new ModulePropertyWithSameValue('description', description);
      }

      this._entityRoot.description = new Description(description);
    }
  }

  public changeStatus(isEnabled: boolean): void {
    if (isEnabled !== undefined) {
      if (this._entityRoot.isEnabled.value === isEnabled) {
        throw new ModulePropertyWithSameValue('isEnabled', isEnabled);
      }

      this._entityRoot.isEnabled = new IsEnabled(isEnabled);
    }
  }

  public clone(): Module {
    return new Module(this.toPrimitives());
  }
}
