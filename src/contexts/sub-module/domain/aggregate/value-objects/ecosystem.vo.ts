export interface IEcosystem {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export class Ecosystem {
  private value = {} as IEcosystem;

  constructor(id: string);
  constructor(schema: IEcosystem);
  constructor(idOrSchema: string | IEcosystem) {
    if (typeof idOrSchema === 'string') {
      this.value.id = idOrSchema;
    } else {
      this.value = idOrSchema;
    }
  }

  public set id(value: string) {
    this.value.id = value;
  }

  public get id() {
    return this.value.id;
  }

  public toPrimitives(): IEcosystem {
    return {
      id: this.value.id,
      name: this.value.name,
      description: this.value.description,
      isEnabled: this.value.isEnabled,
      createdAt: this.value.createdAt,
      updatedAt: this.value.updatedAt,
      deletedAt: this.value.deletedAt,
    };
  }

  static create(ecosystem: IEcosystem): Ecosystem {
    return new Ecosystem(ecosystem);
  }
}
