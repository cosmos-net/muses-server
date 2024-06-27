export interface IListActionCatalogOutputDto {
  id?: string;
  name: string;
}

export class ListActionCatalogOutputDto {
  items: IListActionCatalogOutputDto[];

  constructor(root: IListActionCatalogOutputDto[]){
    this.items = root.map((item) => {
      return {
        id: item.id,
        name: item.name
      }
    });
  }
}
