import Id from '@module-project/domain/aggregate/value-objects/id.vo';
import Name from '@module-project/domain/aggregate/value-objects/name.vo';
import Description from '@module-project/domain/aggregate/value-objects/description.vo';
import Ecosystem, { IEcosystem } from '@module-project/domain/aggregate/value-objects/ecosystem.vo';
import IsEnabled from '@module-project/domain/aggregate/value-objects/is-enabled.vo';
import CreatedAt from '@module-project/domain/aggregate/value-objects/created-at.vo';
import UpdatedAt from '@module-project/domain/aggregate/value-objects/updated-at.vo';
import DeletedAt from '@module-project/domain/aggregate/value-objects/deleted-at.vo';
import { ProjectPropertyWithSameValue } from '@module-project/domain/exceptions/project-property-with-same-value.exception';
import { ProjectIsAlreadyDisabledException } from '@module-project/domain/exceptions/project-is-already-disabled.exception';
export interface IProjectAggregate {
  id: Id;
  name: Name;
  description: Description;
  ecosystem?: Ecosystem;
  isEnabled: IsEnabled;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
  deletedAt?: DeletedAt;
}

export interface IProjectSchema {
  id: string | any;
  name: string;
  description: string;
  ecosystem?: IEcosystem | any;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

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

  get ecosystem(): IEcosystem | undefined {
    return this._entityRoot.ecosystem?.toPrimitives();
  }

  enable(): void {
    this._entityRoot.isEnabled = new IsEnabled(true);
  }

  disable(): void {
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
      if (this._entityRoot.ecosystem instanceof Ecosystem) {
        this._entityRoot.ecosystem.id = schema.ecosystem;
      } else if (this._entityRoot.ecosystem === undefined) {
        this._entityRoot.ecosystem = new Ecosystem(schema.ecosystem);
      }
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

  public changeStatus(isEnabled?: boolean): void {
    if (isEnabled !== undefined) {
      if (this._entityRoot.isEnabled.value === isEnabled) {
        throw new ProjectPropertyWithSameValue('isEnabled', isEnabled);
      }

      this._entityRoot.isEnabled = new IsEnabled(isEnabled);
    }
  }

  public useEcosystem(ecosystem: IEcosystem): void {
    this._entityRoot.ecosystem = new Ecosystem(ecosystem);
  }

  public removeEcosystem(): void {
    delete this._entityRoot.ecosystem;
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
      ecosystem: this._entityRoot.ecosystem?.toPrimitives(),
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
          partialSchema[key] = value.value;
        }
      }
    }

    return partialSchema;
  }
}
