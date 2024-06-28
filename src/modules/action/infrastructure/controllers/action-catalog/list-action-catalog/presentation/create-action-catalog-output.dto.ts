interface IItems {
  id?: string;
  name: string;
}

export interface IListActionCatalogOutputDto {
  items: IItems[];
}

export class ListActionCatalogOutputDto implements IListActionCatalogOutputDto {
  items: IItems[];

  constructor(actionCatalogs: IItems[]) {
    this.items = actionCatalogs.map((actionCatalog) => {
      return {
        id: actionCatalog.id,
        name: actionCatalog.name
      }
    });
  }
}
