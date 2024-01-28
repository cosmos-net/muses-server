export default class CreatedAt {
  constructor(private readonly value: Date) {}

  getValue(): Date {
    return this.value;
  }
}
