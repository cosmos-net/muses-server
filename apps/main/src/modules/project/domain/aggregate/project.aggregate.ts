import { IEcosystemSchema } from '@app-main/modules/commons/domain';
import Id from '@module-project/domain/aggregate/value-objects/id.vo';
import Name from '@module-project/domain/aggregate/value-objects/name.vo';
import Description from '@module-project/domain/aggregate/value-objects/description.vo';
import Ecosystem from '@module-project/domain/aggregate/value-objects/ecosystem.vo';
import IsEnabled from '@module-project/domain/aggregate/value-objects/is-enabled.vo';
import CreatedAt from '@module-project/domain/aggregate/value-objects/created-at.vo';
import UpdatedAt from '@module-project/domain/aggregate/value-objects/updated-at.vo';
import DeletedAt from '@module-project/domain/aggregate/value-objects/deleted-at.vo';

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
    return this._entityRoot.id.getValue();
  }

  get name(): string {
    return this._entityRoot.name.getValue();
  }

  get description(): string {
    return this._entityRoot.description.getValue();
  }

  get ecosystemId(): string | undefined {
    const ecosystem = this._entityRoot.ecosystem?.getValue();
    return ecosystem?.id;
  }

  get isEnabled(): boolean {
    return this._entityRoot.isEnabled.getValue();
  }

  get createdAt(): Date {
    return this._entityRoot.createdAt.getValue();
  }

  get updatedAt(): Date {
    return this._entityRoot.updatedAt.getValue();
  }

  get deletedAt(): Date | undefined {
    return this._entityRoot?.deletedAt?.getValue();
  }

  enabled(): void {
    this._entityRoot.isEnabled = new IsEnabled(true);
  }

  disabled(): void {
    this._entityRoot.isEnabled = new IsEnabled(false);
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

  public useEcosystem(ecosystem: IEcosystemSchema): void {
    this._entityRoot.ecosystem = new Ecosystem(ecosystem);
  }

  public entityRoot(): IProjectAggregate {
    return this._entityRoot;
  }

  public toPrimitives(): IProjectSchema {
    return {
      id: this._entityRoot.id.getValue(),
      name: this._entityRoot.name.getValue(),
      description: this._entityRoot.description.getValue(),
      ecosystem: this._entityRoot.ecosystem?.getValue(),
      isEnabled: this._entityRoot.isEnabled.getValue(),
      createdAt: this._entityRoot.createdAt.getValue(),
      updatedAt: this._entityRoot.updatedAt.getValue(),
      deletedAt: this._entityRoot.deletedAt?.getValue(),
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
