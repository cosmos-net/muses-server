import Id from '@module-project/domain/aggregate/value-objects/id.vo';
import Name from '@module-project/domain/aggregate/value-objects/name.vo';
import Description from '@module-project/domain/aggregate/value-objects/description.vo';
import Ecosystem from '@module-project/domain/aggregate/value-objects/ecosystem.vo';
import IsEnabled from '@module-project/domain/aggregate/value-objects/is-enabled.vo';
import CreatedAt from '@module-project/domain/aggregate/value-objects/created-at.vo';
import UpdatedAt from '@module-project/domain/aggregate/value-objects/updated-at.vo';
import DeletedAt from '@module-project/domain/aggregate/value-objects/deleted-at.vo';
import { IEcosystemSchema } from '@app-main/modules/ecosystem/domain/aggregate/ecosystem.schema';

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
  id: string;
  name: string;
  description: string;
  ecosystem?: IEcosystemSchema;
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
    return this._entityRoot.id.value;
  }

  get name(): string {
    return this._entityRoot.name.value;
  }

  get description(): string {
    return this._entityRoot.description.value;
  }

  get ecosystemId(): string | undefined {
    const ecosystem = this._entityRoot.ecosystem?.value;
    return ecosystem?.id;
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

  enable(): void {
    this._entityRoot.isEnabled = new IsEnabled(true);
  }

  disable(): void {
    this._entityRoot.isEnabled = new IsEnabled(false);
    this._entityRoot.deletedAt = new DeletedAt(new Date());
  }

  public hydrate(schema: IProjectSchema): void {
    this._entityRoot = {
      id: new Id(schema.id),
      name: new Name(schema.name),
      description: new Description(schema.description),
      isEnabled: new IsEnabled(schema.isEnabled),
      createdAt: new CreatedAt(schema.createdAt),
      updatedAt: new UpdatedAt(schema.updatedAt),
      ecosystem: schema.ecosystem ? new Ecosystem(schema.ecosystem) : undefined,
    };
  }

  public describe(name: string, description?: string): void {
    this._entityRoot.name = new Name(name);

    if (description) {
      this._entityRoot.description = new Description(description);
    }
  }

  public redescribe(name?: string, description?: string): void {
    if (name) {
      this._entityRoot.name = new Name(name);
    }

    if (description) {
      this._entityRoot.description = new Description(description);
    }
  }

  public useEcosystem(ecosystem: IEcosystemSchema): void {
    this._entityRoot.ecosystem = new Ecosystem(ecosystem);
  }

  public entityRoot(): IProjectAggregate {
    return this._entityRoot;
  }

  public toPrimitives(): IProjectSchema {
    return {
      id: this._entityRoot.id.value,
      name: this._entityRoot.name.value,
      description: this._entityRoot.description.value,
      ecosystem: this._entityRoot.ecosystem?.value,
      isEnabled: this._entityRoot.isEnabled.value,
      createdAt: this._entityRoot.createdAt.value,
      updatedAt: this._entityRoot.updatedAt.value,
      deletedAt: this._entityRoot.deletedAt?.value,
    };
  }

  public fromPrimitives(schema: IProjectSchema): void {
    this.hydrate(schema);
  }

  public entityRootPartial(): Partial<IProjectSchema> {
    const partialSchema: Partial<IProjectSchema> = {};
    for (const [key, value] of Object.entries(this._entityRoot)) {
      if (value instanceof Object) {
        partialSchema[key] = value.value;
      }
    }

    return partialSchema;
  }
}
