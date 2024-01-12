export class DeleteEcosystemCommand {
  readonly id: string;

  constructor(props: Partial<DeleteEcosystemCommand>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
