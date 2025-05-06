export class GetModulesByIdsQuery {
  ids: string[];

  constructor(props: Partial<GetModulesByIdsQuery>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
