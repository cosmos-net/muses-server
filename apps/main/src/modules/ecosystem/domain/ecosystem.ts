import { IEcosystemSchema } from '@app-main/modules/commons/domain';
import { EcosystemNotFoundException } from '@app-main/modules/ecosystem/domain/exceptions/ecosystem-not-found.exception';

export class Ecosystem {
  private _entityRoot = {} as IEcosystemSchema;

  constructor(schema?: IEcosystemSchema | null) {
    this._entityRoot.isEnabled = true;
    if (schema === null) {
      throw new EcosystemNotFoundException();
    }

    if (schema) {
      this.hydrate(schema);
    }
  }

  get id(): string {
    return this._entityRoot.id;
  }

  get name(): string {
    return this._entityRoot.name;
  }

  get description(): string {
    return this._entityRoot.description;
  }

  get isEnabled(): boolean {
    return this._entityRoot.isEnabled;
  }

  get createdAt(): Date {
    return this._entityRoot.createdAt;
  }

  get updatedAt(): Date {
    return this._entityRoot.updatedAt;
  }

  get deletedAt(): Date {
    return this._entityRoot.deletedAt;
  }

  public describe(name: string, description?: string): void {
    this._entityRoot.name = name;

    if (description) {
      this._entityRoot.description = description;
    }
  }

  public rename(name?: string, description?: string): void {
    if (name) {
      this._entityRoot.name = name;
    }

    if (description) {
      this._entityRoot.description = description;
    }
  }

  public enabled(): void {
    this._entityRoot.isEnabled = true;
  }

  public disabled(): void {
    this._entityRoot.isEnabled = false;
  }

  public hydrate(schema: IEcosystemSchema): void {
    if (!schema) {
      throw new EcosystemNotFoundException();
    }

    this._entityRoot = schema;
  }

  public entityRoot(): IEcosystemSchema {
    return this._entityRoot;
  }

  public toPrimitives(): Record<string, unknown> {
    return {
      name: this._entityRoot.name,
      description: this._entityRoot.description,
      enabled: this._entityRoot.isEnabled,
      createdAt: this._entityRoot.createdAt,
      updatedAt: this._entityRoot.updatedAt,
      deletedAt: this._entityRoot.deletedAt,
    };
  }
}
