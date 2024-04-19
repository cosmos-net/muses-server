import { EcosystemNotFoundException } from '@module-eco/domain/exceptions/ecosystem-not-found.exception';
import { EcosystemAlreadyDisabledException } from '@app-main/modules/ecosystem/domain/exceptions/ecosystem-already-disabled.exception';
import { IEcosystemSchema } from '@module-eco/domain/aggregate/ecosystem.schema';
import { IEcosystemSchemaValueObject } from '@module-eco/domain/aggregate/ecosystem.schema.vo';
import Id from '@module-eco/domain/aggregate/value-objects/id.vo';
import Name from '@module-eco/domain/aggregate/value-objects/name.vo';
import Description from '@module-eco/domain/aggregate/value-objects/description.vo';
import IsEnabled from '@module-eco/domain/aggregate/value-objects/is-enabled.vo';
import CreatedAt from '@module-eco/domain/aggregate/value-objects/created-at.vo';
import UpdatedAt from '@module-eco/domain/aggregate/value-objects/updated-at.vo';
import DeletedAt from '@module-eco/domain/aggregate/value-objects/deleted-at.vo';
import { EcosystemPropertyWithSameValue } from '@module-eco/domain/exceptions/ecosystem-property-with-same-value.exception';
import { EcosystemAlreadyEnabledException } from '@module-eco/domain/exceptions/ecosystem-already-enabled.exception';

export class Ecosystem {
  private _entityRoot = {} as IEcosystemSchemaValueObject;

  constructor(schema: IEcosystemSchema);
  constructor(name: string, description?: string, isEnabled?: boolean);
  constructor(schemaOrName?: IEcosystemSchema | string, description?: string, isEnabled?: boolean) {
    if (schemaOrName instanceof Object) {
      this.hydrate(schemaOrName);
    } else {
      if (typeof schemaOrName === 'string') this._entityRoot.name = new Name(schemaOrName);
      if (description) this._entityRoot.description = new Description(description);

      if (isEnabled !== undefined) {
        this._entityRoot.isEnabled = new IsEnabled(isEnabled);
      } else {
        this._entityRoot.isEnabled = new IsEnabled(true);
      }
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

  private hydrate(schema: IEcosystemSchema): void {
    if (!schema) {
      throw new EcosystemNotFoundException();
    }

    this._entityRoot.id = new Id(schema.id);
    this._entityRoot.name = new Name(schema.name);
    this._entityRoot.description = new Description(schema.description);
    this._entityRoot.isEnabled = new IsEnabled(schema.isEnabled);
    this._entityRoot.createdAt = new CreatedAt(schema.createdAt);
    this._entityRoot.updatedAt = new UpdatedAt(schema.updatedAt);
    this._entityRoot.deletedAt = schema.deletedAt ? new DeletedAt(schema.deletedAt) : undefined;
  }

  public describe(name: string, description?: string): void {
    this._entityRoot.name = new Name(name);

    if (description) {
      this._entityRoot.description = new Description(description);
    }
  }

  public redescribe(name?: string, description?: string): void {
    if (name) {
      if (name === this._entityRoot.name.value) {
        throw new EcosystemPropertyWithSameValue('name', name);
      }

      this._entityRoot.name = new Name(name);
    }

    if (description) {
      if (description === this._entityRoot.description.value) {
        throw new EcosystemPropertyWithSameValue('description', description);
      }

      this._entityRoot.description = new Description(description);
    }
  }

  public enable(): void {
    if (this._entityRoot.isEnabled.value === true) {
      throw new EcosystemAlreadyEnabledException();
    }

    this._entityRoot.isEnabled = new IsEnabled(true);

    if (this._entityRoot.deletedAt) {
      this._entityRoot.deletedAt = undefined;
    }
  }

  public disable(): void {
    if (this._entityRoot.isEnabled.value === false) {
      throw new EcosystemAlreadyDisabledException();
    }

    this._entityRoot.isEnabled = new IsEnabled(false);
    this._entityRoot.deletedAt = new DeletedAt(new Date());
  }

  public entityRootWithoutIdentifier(): Omit<IEcosystemSchema, 'id'> {
    return {
      name: this._entityRoot.name.value,
      description: this._entityRoot.description.value,
      isEnabled: this._entityRoot.isEnabled.value,
      createdAt: this._entityRoot.createdAt.value,
      updatedAt: this._entityRoot.updatedAt.value,
      deletedAt: this._entityRoot.deletedAt?.value,
    };
  }

  public toValueObject(): IEcosystemSchemaValueObject {
    return this._entityRoot;
  }

  public toPrimitives(): IEcosystemSchema {
    return {
      id: this._entityRoot.id.value,
      name: this._entityRoot.name.value,
      description: this._entityRoot.description.value,
      isEnabled: this._entityRoot.isEnabled.value,
      createdAt: this._entityRoot.createdAt.value,
      updatedAt: this._entityRoot.updatedAt.value,
      deletedAt: this._entityRoot.deletedAt?.value,
    };
  }

  public fromPrimitives(schema: IEcosystemSchema): void {
    this.hydrate(schema);
  }

  public partialEcosystemSchema(): Partial<IEcosystemSchema> {
    const partialSchema: Partial<IEcosystemSchema> = {};

    for (const [key, value] of Object.entries(this._entityRoot)) {
      if (value instanceof Object) {
        partialSchema[key] = value.value;
      }
    }

    return partialSchema;
  }
}
