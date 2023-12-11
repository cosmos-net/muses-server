import { RolesEnum } from '@management-auth/modules/user/domain/roles.enum';
import * as bcrypt from 'bcrypt';

export interface IUserSchema {
  id: number;
  uuid: string;
  email: string;
  username: string;
  password: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  roles: RolesEnum[];
}

export class User {
  private _entityRoot = {} as IUserSchema;

  constructor(schema?: IUserSchema) {
    if (schema) {
      this.hydrate(schema);
    }
  }

  get id(): number {
    return this._entityRoot.id;
  }

  get uuid(): string {
    return this._entityRoot.uuid;
  }

  get email(): string {
    return this._entityRoot.email;
  }

  get username(): string {
    return this._entityRoot.username;
  }

  get password(): string {
    return this._entityRoot.password;
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

  get roles(): RolesEnum[] {
    return this._entityRoot.roles;
  }

  protected hydrate(schema: IUserSchema): void {
    this._entityRoot = schema;
  }

  public entityRoot(): IUserSchema {
    return this._entityRoot;
  }

  public toPrimitives(): IUserSchema {
    return this._entityRoot;
  }

  public enabled(): void {
    this._entityRoot.enabled = true;
  }

  public disabled(): void {
    this._entityRoot.enabled = false;
  }

  public withRoles(roles: RolesEnum[]): void {
    this._entityRoot.roles = roles;
  }

  public initializeCredentials(
    email: string,
    username: string,
    password: string,
  ): void {
    this._entityRoot.email = email;
    this._entityRoot.username = username;
    this._entityRoot.password = password;
  }

  public async encryptPassword(hashSalt: number): Promise<void> {
    this._entityRoot.password = await bcrypt.hash(
      this._entityRoot.password,
      hashSalt,
    );
  }
}
