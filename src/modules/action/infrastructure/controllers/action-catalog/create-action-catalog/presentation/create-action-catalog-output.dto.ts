export interface ICreateActionCatalogOutputDto {
  id?: string;
  name: string;
}

export class CreateActionCatalogOutputDto implements ICreateActionCatalogOutputDto {
  id?: string;
  name: string;

  constructor(root: ICreateActionCatalogOutputDto) {
    this.id = root.id;
    this.name = root.name;
  }
}