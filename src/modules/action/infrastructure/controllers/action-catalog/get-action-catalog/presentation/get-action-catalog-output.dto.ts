export interface IGetActionCatalogOutputDto {
  id?: string;
  name: string;
}

export class GetActionCatalogOutputDto implements IGetActionCatalogOutputDto {
  id?: string;
  name: string;

  constructor(root: IGetActionCatalogOutputDto) {
    this.id = root.id;
    this.name = root.name;
  }
}