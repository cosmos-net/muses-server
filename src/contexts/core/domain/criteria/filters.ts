import { Filter } from '@core/domain/criteria/filter';
import { Primitives } from '@core/domain/value-object/value-object';

export class Filters {
  readonly filters: Filter[];

  constructor(filters: Filter[]) {
    this.filters = filters;
  }

  static fromValues(filters: Array<Map<string, Primitives>>): Filters {
    return new Filters(filters.map(Filter.fromValues));
  }

  static none(): Filters {
    return new Filters([]);
  }
}
