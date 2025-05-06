export class GetSubModulesByIdsQuery {
  ids: string[];

  constructor(props: Partial<GetSubModulesByIdsQuery>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
