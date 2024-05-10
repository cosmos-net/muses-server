import Id from '@module-project/domain/aggregate/value-objects/id.vo';
import Name from '@module-project/domain/aggregate/value-objects/name.vo';
import Description from '@module-project/domain/aggregate/value-objects/description.vo';
import IsEnabled from '@module-project/domain/aggregate/value-objects/is-enabled.vo';
import CreatedAt from '@module-project/domain/aggregate/value-objects/created-at.vo';
import UpdatedAt from '@module-project/domain/aggregate/value-objects/updated-at.vo';
import DeletedAt from '@module-project/domain/aggregate/value-objects/deleted-at.vo';
import { ProjectPropertyWithSameValue } from '@module-project/domain/exceptions/project-property-with-same-value.exception';
import { ProjectIsAlreadyDisabledException } from '@module-project/domain/exceptions/project-is-already-disabled.exception';
import { IProjectSchema } from '@module-project/domain/aggregate/project.schema';
import { IProjectAggregate } from '@module-project/domain/aggregate/project.aggregate';
import { Module } from '@module-module/domain/aggregate/module';
import { ModuleAlreadyRelatedWithProjectException } from '@module-project/domain/exceptions/module-already-related-with-project.exception';
import { ModuleNotFoundException } from '@module-common/domain/exceptions/module-not-found.exception';
import { ProjectIsAlreadyEnabledException } from '@module-project/domain/exceptions/project-is-already-enabled.exception';
import { removePropertyFromObject } from '@lib-commons/domain/helpers/utils';
import { Ecosystem } from '@module-eco/domain/aggregate/ecosystem';
import { IEcosystemSchema } from '@module-eco/domain/aggregate/ecosystem.schema';

export class Project {
  private _entityRoot = {} as IProjectAggregate;

  constructor(schema?: IProjectSchema | null) {
    if (schema instanceof Object) {
      this.hydrate(schema);
    } else {
      this._entityRoot.isEnabled = new IsEnabled(true);
    }
  }

  get id(): string {
    return this._entityRoot.id?.value;
  }

  get name(): string {
    return this._entityRoot.name.value;
  }

  get description(): string {
    return this._entityRoot.description.value;
  }

  get ecosystemId(): string | undefined {
    if (typeof this._entityRoot.ecosystem === 'string') {
      return this._entityRoot.ecosystem;
    }

    return this._entityRoot.ecosystem?.id;
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
    return this._entityRoot?.deletedAt?.value;
  }

  get ecosystem(): string | IEcosystemSchema | undefined {
    if (typeof this._entityRoot.ecosystem === 'string') {
      return this._entityRoot.ecosystem;
    }

    return this._entityRoot.ecosystem?.toPrimitives();
  }

  public enable(): void {
    if (this._entityRoot.isEnabled.value === true) {
      throw new ProjectIsAlreadyEnabledException();
    }

    this._entityRoot.isEnabled = new IsEnabled(true);
    this._entityRoot = removePropertyFromObject<IProjectAggregate, 'deletedAt'>(this._entityRoot, 'deletedAt');
  }

  public disable(): void {
    if (this._entityRoot.isEnabled.value === false) {
      throw new ProjectIsAlreadyDisabledException();
    }

    this._entityRoot.isEnabled = new IsEnabled(false);
    this._entityRoot.deletedAt = new DeletedAt(new Date());
  }

  public hydrate(schema: IProjectSchema): void {
    this._entityRoot.id = new Id(schema.id);
    this._entityRoot.name = new Name(schema.name);
    this._entityRoot.description = new Description(schema.description);
    this._entityRoot.isEnabled = new IsEnabled(schema.isEnabled);
    this._entityRoot.createdAt = new CreatedAt(schema.createdAt);
    this._entityRoot.updatedAt = new UpdatedAt(schema.updatedAt);

    if (schema.deletedAt && !this._entityRoot.deletedAt) {
      this._entityRoot.deletedAt = new DeletedAt(schema.deletedAt);
    }

    if (typeof schema.ecosystem === 'string') {
      if (this._entityRoot.ecosystem === undefined) {
        this._entityRoot.ecosystem = schema.ecosystem;
      }
    }

    if (Array.isArray(schema.modules)) {
      this._entityRoot.modules = schema.modules;
    }
  }

  public describe(name: string, description?: string): void {
    this._entityRoot.name = new Name(name);

    if (description) {
      this._entityRoot.description = new Description(description);
    }
  }

  public redescribe(name?: string, description?: string): void {
    if (name) {
      if (this._entityRoot.name.value === name) {
        throw new ProjectPropertyWithSameValue('name', name);
      }

      this._entityRoot.name = new Name(name);
    }

    if (description) {
      if (this._entityRoot.description.value === description) {
        throw new ProjectPropertyWithSameValue('description', description);
      }

      this._entityRoot.description = new Description(description);
    }
  }

  public useEcosystem(ecosystem: Ecosystem): void {
    this._entityRoot.ecosystem = ecosystem;
  }

  public removeEcosystem(): void {
    this._entityRoot = removePropertyFromObject<IProjectAggregate, 'ecosystem'>(this._entityRoot, 'ecosystem');
  }

  public addModule(module: Module): void {
    if (this._entityRoot.modules && this._entityRoot.modules.length > 0) {
      const isModuleAlreadyAdded = this._entityRoot.modules.find((m) => {
        return typeof m === 'string' ? m === module.id : m.id === module.id;
      });

      if (isModuleAlreadyAdded) {
        throw new ModuleAlreadyRelatedWithProjectException();
      }

      this._entityRoot.modules.push(module);

      return;
    }

    this._entityRoot.modules = [module];
  }

  public removeModule(module: Module): void {
    if (this._entityRoot.modules && this._entityRoot.modules.length > 0) {
      const moduleIndex = this._entityRoot.modules.findIndex((m) => {
        return typeof m === 'string' ? m === module.id : m.id === module.id;
      });

      if (moduleIndex === -1) {
        throw new ModuleNotFoundException();
      }

      this._entityRoot.modules.splice(moduleIndex, 1);
    }
  }

  public entityRoot(): IProjectAggregate {
    return this._entityRoot;
  }

  public toPrimitives(): IProjectSchema {
    return {
      id: this._entityRoot.id?.value,
      name: this._entityRoot.name.value,
      description: this._entityRoot.description.value,
      isEnabled: this._entityRoot.isEnabled.value,
      createdAt: this._entityRoot.createdAt.value,
      updatedAt: this._entityRoot.updatedAt.value,
      deletedAt: this._entityRoot.deletedAt?.value,
      ecosystem: this.ecosystem,
    };
  }

  public fromPrimitives(schema: IProjectSchema): void {
    this.hydrate(schema);
  }

  public entityRootPartial(): Partial<IProjectSchema> {
    const partialSchema: Partial<IProjectSchema> = {};

    for (const [key, value] of Object.entries(this._entityRoot)) {
      if (value instanceof Object) {
        if (value.value !== null) {
          if (key === 'modules') {
            partialSchema[key] = value.map((module) => {
              return typeof module === 'string' ? module : module.id;
            });

            continue;
          }

          if (key === 'ecosystem') {
            partialSchema[key] = value.id;
            continue;
          }

          partialSchema[key] = value.value;
        }

        continue;
      }

      partialSchema[key] = value;
    }

    return partialSchema;
  }
}
