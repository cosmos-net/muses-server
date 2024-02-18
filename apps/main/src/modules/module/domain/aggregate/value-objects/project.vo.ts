export interface IProject {
  id: string | any;
  name: string;
  description: string;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export default class Project {
  private value = {} as IProject;

  constructor(id: string);
  constructor(schema: IProject);
  constructor(idOrSchema: string | IProject) {
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

  public toPrimitives(): IProject {
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

  static create(project: IProject): Project {
    return new Project(project);
  }
}
