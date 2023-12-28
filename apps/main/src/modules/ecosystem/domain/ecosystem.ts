import { IEcosystemSchema } from '@app-main/modules/commons/domain';
import { ObjectId } from 'mongodb';

export class Ecosystem {
  private _entityRoot = {} as IEcosystemSchema;

  constructor(schema?: IEcosystemSchema | null) {
    this._entityRoot.enabled = true;
    if (schema === null) {
      this.newError('Schema not found');
    }

    if (schema) {
      this.hydrate(schema);
    }
  }

  get _id(): ObjectId {
    return this._entityRoot._id;
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
    return this._entityRoot.enabled;
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
    this._entityRoot.enabled = true;
  }

  public disabled(): void {
    this._entityRoot.enabled = false;
  }

  public hydrate(schema: IEcosystemSchema): void {
    if (!schema) {
      throw new Error('Information not found error');
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
      enabled: this._entityRoot.enabled,
      createdAt: this._entityRoot.createdAt,
      updatedAt: this._entityRoot.updatedAt,
      deletedAt: this._entityRoot.deletedAt,
    };
  }

  public newError(message: string): void {
    throw new Error(message);
  }
}
