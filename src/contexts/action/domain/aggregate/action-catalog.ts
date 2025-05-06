export interface IActionCatalogSchema {
  id?: string;
  name: string;
}

export class ActionCatalog {
  constructor(private readonly schema: IActionCatalogSchema) {}

  get id(): string | undefined {
    return this.schema.id;
  }

  get name(): string {
    return this.schema.name;
  }

  public hydrate(schema: IActionCatalogSchema): void {
    this.schema.id = schema.id;
    this.schema.name = schema.name;
  }

  public entityRoot(): IActionCatalogSchema {
    return this.schema;
  }

  public toPrimitives(): IActionCatalogSchema {
    return {
      id: this.schema.id,
      name: this.schema.name,
    }
  }
}
