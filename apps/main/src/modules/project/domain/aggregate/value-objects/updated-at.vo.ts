export default class UpdatedAt {
  constructor(private readonly value: Date) {}

  getValue(): Date {
    return this.value;
  }
}
