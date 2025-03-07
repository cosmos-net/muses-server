import Id from '@module-module/domain/aggregate/value-objects/id.vo';
import Name from '@module-module/domain/aggregate/value-objects/name.vo';
import Description from '@module-module/domain/aggregate/value-objects/description.vo';
import CreatedAt from '@module-module/domain/aggregate/value-objects/created-at.vo';
import DeletedAt from '@module-module/domain/aggregate/value-objects/deleted-at.vo';
import UpdatedAt from '@module-module/domain/aggregate/value-objects/updated-at.vo';
import IsEnabled from '@module-module/domain/aggregate/value-objects/is-enabled.vo';
import { ModuleIsAlreadyDisabledUsedException } from '@module-module/domain/exceptions/module-is-already-disabled.exception';
import { IModuleSchemaAggregate } from '@module-module/domain/aggregate/module.schema.vo';
import { IModuleSchema } from '@module-module/domain/aggregate/module.schema';
import { ModulePropertyWithSameValue } from '@module-module/domain/exceptions/module-property-with-same-value.exception';
import { SubModule } from '@module-sub-module/domain/aggregate/sub-module';
import { SubModuleAlreadyRelatedWithModuleException } from '@module-sub-module/domain/exceptions/sub-module-already-related-with-module.exception';
import { SubModuleNotFoundException } from '@module-common/domain/exceptions/sub-module-not-found.exception';
import { Project } from '@module-project/domain/aggregate/project';
import { IProjectSchema } from '@module-project/domain/aggregate/project.schema';
import { ModuleIsAlreadyEnabledUsedException } from '../exceptions/module-is-already-enabled.exception';

export class Module {
  private readonly _entityRoot = {} as IModuleSchemaAggregate;

  constructor(schema?: IModuleSchema | null) {
    if (schema) {
      this.hydrate(schema);
      return;
    }

    this._entityRoot.isEnabled = new IsEnabled(true);
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
    if (this._entityRoot.project instanceof Project) {
      return this._entityRoot.project.id;
    }

    return this._entityRoot.project;
  }

  get project(): string | IProjectSchema {
    if (this._entityRoot.project instanceof Project) {
      return this._entityRoot.project.toPrimitives();
    }

    return this._entityRoot.project;
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

  get subModules(): (SubModule | string)[] {
    return this._entityRoot.subModules;
  }

  get actions(): string[] | undefined {
    return this._entityRoot.actions;
  }

  set id(id: string) {
    this._entityRoot.id = new Id(id);
  }

  public enable(): void {
    if (this._entityRoot.isEnabled.value === true) {
      throw new ModuleIsAlreadyEnabledUsedException();
    }

    this._entityRoot.isEnabled = new IsEnabled(true);
    this._entityRoot.deletedAt = undefined;
  }

  public disable(): void {
    if (this._entityRoot.isEnabled.value === false) {
      throw new ModuleIsAlreadyDisabledUsedException();
    }

    this._entityRoot.isEnabled = new IsEnabled(false);
    this._entityRoot.deletedAt = new DeletedAt(new Date());
  }

  public hydrateSubModules(subModules?: string[]): void {
    if (subModules) {
      if (!this._entityRoot.subModules) {
        this._entityRoot.subModules = [];
      }

      for (const subModule of subModules) {
        const isSubModuleAlreadyAdded = this._entityRoot.subModules.find(
          (s) => s instanceof SubModule && s.id === subModule,
        );

        if (!isSubModuleAlreadyAdded) {
          this._entityRoot.subModules.push(subModule);
        }
      }
    }
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
      if (!this._entityRoot.project) {
        this._entityRoot.project = schema.project;
      }
    }

    this.hydrateSubModules(schema.subModules);
  }

  public describe(name: string, description: string): void {
    this._entityRoot.name = new Name(name);
    this._entityRoot.description = new Description(description);
  }

  public useProject(project: Project): void {
    this._entityRoot.project = project;
  }

  public toPrimitives(): IModuleSchema {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      subModules: this.subModules,
      actions: this.actions,
      isEnabled: this.isEnabled,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      project: this.project,
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
          if (key === 'subModules') {
            partialSchema[key] = value.map((subModule) => subModule.id);
            continue;
          } else if (key === 'project') {
            if (value instanceof Project) {
              partialSchema[key] = value.id;
              continue;
            }
          }

          partialSchema[key] = value.value;
        }

        continue;
      }

      if (value) {
        partialSchema[key] = value;
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

  public addSubModule(subModule: SubModule): void {
    if (!this._entityRoot.subModules) {
      this._entityRoot.subModules = [];
      this._entityRoot.subModules.push(subModule);
      return;
    }

    if (this._entityRoot.subModules && this._entityRoot.subModules.length > 0) {
      const isSubmoduleAlreadyAdded = this._entityRoot.subModules.find(
        (s) => s instanceof SubModule && s.id === subModule.id,
      );

      if (isSubmoduleAlreadyAdded) {
        throw new SubModuleAlreadyRelatedWithModuleException();
      }

      this._entityRoot.subModules.push(subModule);

      return;
    }

    this._entityRoot.subModules.push(subModule);
  }

  public removeSubModule(subModuleId: string): void {
    if (this._entityRoot.subModules && this._entityRoot.subModules.length > 0) {
      const subModuleIndex = this._entityRoot.subModules.findIndex((subModule) => {
        if (typeof subModule === 'string') {
          return subModule === subModuleId;
        }

        return subModule.id === subModuleId;
      });

      if (subModuleIndex === -1) {
        throw new SubModuleNotFoundException();
      }

      this._entityRoot.subModules.splice(subModuleIndex, 1);
    }
  }

  public removeAction(actionId: string): void {
    if (this._entityRoot.actions && this._entityRoot.actions.length > 0) {
      const actionIndex = this._entityRoot.actions.findIndex((action) => action === actionId);

      if (actionIndex === -1) {
        throw new Error('Action not found');
      }

      if (this._entityRoot.actions.length === 1) {
        delete this._entityRoot.actions;
        return;
      }

      this._entityRoot.actions.splice(actionIndex, 1);
    }
  }

  public addAction(actionId: string): void {
    if (!this._entityRoot.actions) {
      this._entityRoot.actions = [actionId];

      return;
    }

    if (this._entityRoot.actions && this._entityRoot.actions.length > 0) {
      const isActionAlreadyAdded = this._entityRoot.actions.find((action) => action === actionId);

      if (isActionAlreadyAdded) {
        throw new Error('Action already added');
      }
    }

    this._entityRoot.actions.push(actionId);
  }
}
