export default class IsEnabled {
  constructor(private readonly props: boolean) {}

  get value(): boolean {
    return this.props;
  }
}
