import { ConflictException } from '@nestjs/common';
import { FilterField } from '@lib-commons/domain/criteria/filter-field';
import { FilterOperator } from '@lib-commons/domain/criteria/filter-operator';
import { FilterValue } from '@lib-commons/domain/criteria/filter-value';

export class Filter {
  readonly field: FilterField;
  readonly operator: FilterOperator;
  readonly value: FilterValue;

  constructor(field: FilterField, operator: FilterOperator, value: FilterValue) {
    this.field = field;
    this.operator = operator;
    this.value = value;
  }

  static fromValues(values: Map<string, string>): Filter {
    const field = values.get('field');
    const operator = values.get('operator');
    const value = values.get('value');

    if (!field || !operator || !value) {
      throw new ConflictException(`The filter is invalid`);
    }

    return new Filter(new FilterField(field), FilterOperator.fromValue(operator), new FilterValue(value));
  }
}
