export default class DeletedAt {
  constructor(private readonly value: Date) {}

  getValue(): Date {
    return this.value;
  }
}
