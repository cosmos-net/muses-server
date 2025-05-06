export class CreateActionCatalogCommand {
  readonly name: string;

  constructor(props?: CreateActionCatalogCommand) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
