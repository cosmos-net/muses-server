export default class IsEnabled {
  constructor(private readonly value: boolean) {}

  getValue(): boolean {
    return this.value;
  }

  static create(value: boolean): IsEnabled {
    return new IsEnabled(value);
  }
}
