import { ConflictException } from '@nestjs/common';
import { FilterField } from '@core/domain/criteria/filter-field';
import { FilterOperator } from '@core/domain/criteria/filter-operator';
import { FilterValue } from '@core/domain/criteria/filter-value';
import { Primitives } from '@core/domain/value-object/value-object';

export class Filter {
  readonly field: FilterField;
  readonly operator: FilterOperator;
  readonly value: FilterValue<Primitives>;

  constructor(field: FilterField, operator: FilterOperator, value: FilterValue<Primitives>) {
    this.field = field;
    this.operator = operator;
    this.value = value;
  }

  getValue(): Primitives {
    return this.value.value;
  }

  static fromValues<T extends Primitives>(values: Map<string, T>): Filter {
    const field = values.get('field');
    const operator = values.get('operator');
    const value = values.get('value');

    if (operator === undefined || field === undefined || value === undefined) {
      throw new ConflictException(`The filter is invalid`);
    }

    const filterField = typeof field === 'string' ? new FilterField(field) : undefined;
    const filterOperator = typeof operator === 'string' ? FilterOperator.fromValue(operator) : undefined;
    const filterValue = new FilterValue<T>(value);

    if (!filterField || !filterOperator) {
      throw new ConflictException(`The filter is invalid`);
    }

    return new Filter(filterField, filterOperator, filterValue);
  }
}
