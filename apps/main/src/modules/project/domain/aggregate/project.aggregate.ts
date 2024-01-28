import { IEcosystemSchema } from '@app-main/modules/commons/domain';
import Id from '@app-main/modules/project/domain/aggregate/value-objects/id.vo';
import Name from '@app-main/modules/project/domain/aggregate/value-objects/name.vo';
import Description from '@app-main/modules/project/domain/aggregate/value-objects/description.vo';
import Ecosystem from '@app-main/modules/project/domain/aggregate/value-objects/ecosystem.vo';
import IsEnabled from '@app-main/modules/project/domain/aggregate/value-objects/is-enabled.vo';
import CreatedAt from '@app-main/modules/project/domain/aggregate/value-objects/created-at.vo';
import UpdatedAt from '@app-main/modules/project/domain/aggregate/value-objects/updated-at.vo';
import DeletedAt from '@app-main/modules/project/domain/aggregate/value-objects/deleted-at.vo';

export interface IProjectAggregate {
  id: Id;
  name: Name;
  description: Description;
  ecosystem: Ecosystem;
  isEnabled: IsEnabled;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
  deletedAt: DeletedAt;
}

export interface IProject {
  id: string;
  name: string;
  description: string;
  ecosystem: IEcosystemSchema;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export class Project {
  private _entityRoot: IProjectAggregate;

  constructor(schema?: IProject) {
    this._entityRoot = {} as IProjectAggregate;
    this._entityRoot.isEnabled = new IsEnabled(true);

    if (schema) {
      this.hydrate(schema);
    }
  }

  enabled(): void {
    this._entityRoot.isEnabled = new IsEnabled(true);
  }

  disabled(): void {
    this._entityRoot.isEnabled = new IsEnabled(false);
  }

  public hydrate(schema: IProject): void {
    this._entityRoot = {
      id: new Id(schema.id),
      name: new Name(schema.name),
      description: new Description(schema.description),
      ecosystem: new Ecosystem(schema.ecosystem),
      isEnabled: new IsEnabled(schema.isEnabled),
      createdAt: new CreatedAt(schema.createdAt),
      updatedAt: new UpdatedAt(schema.updatedAt),
      deletedAt: new DeletedAt(schema.deletedAt),
    };
  }

  public describe(name: string, description: string | undefined): void {
    this._entityRoot.name = new Name(name);

    if (description) {
      this._entityRoot.description = new Description(description);
    }
  }

  public useEcosystem(ecosystem: IEcosystemSchema): void {
    this._entityRoot.ecosystem = new Ecosystem(ecosystem);
  }
}
