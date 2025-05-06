export class DisableEcosystemCommand {
  readonly id: string;

  constructor(props: Partial<DisableEcosystemCommand>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
