import { EnumValueObject } from '@lib-commons/domain/value-object/enum-value-object';
import { ConflictException } from '@nestjs/common';

export enum Operator {
  EQUAL = '=',
  NOT_EQUAL = '!=',
  GT = '>',
  GTE = '>=',
  LT = '<',
  LTE = '<=',
  IN = 'IN',
  CONTAINS = 'CONTAINS',
  NOT_CONTAINS = 'NOT_CONTAINS',
  STARTS_WITH = 'STARTS_WITH',
  ENDS_WITH = 'ENDS_WITH',
  IS_NULL = 'IS_NULL',
  NOT_NULL = 'NOT_NULL',
}

export class FilterOperator extends EnumValueObject<Operator> {
  constructor(value: Operator) {
    super(value, Object.values(Operator));
  }

  static fromValue(value: string): FilterOperator {
    switch (value) {
      case Operator.EQUAL:
        return new FilterOperator(Operator.EQUAL);
      case Operator.NOT_EQUAL:
        return new FilterOperator(Operator.NOT_EQUAL);
      case Operator.GT:
        return new FilterOperator(Operator.GT);
      case Operator.GTE:
        return new FilterOperator(Operator.GTE);
      case Operator.LT:
        return new FilterOperator(Operator.LT);
      case Operator.LTE:
        return new FilterOperator(Operator.LTE);
      case Operator.CONTAINS:
        return new FilterOperator(Operator.CONTAINS);
      case Operator.NOT_CONTAINS:
        return new FilterOperator(Operator.NOT_CONTAINS);
      case Operator.STARTS_WITH:
        return new FilterOperator(Operator.STARTS_WITH);
      case Operator.ENDS_WITH:
        return new FilterOperator(Operator.ENDS_WITH);
      case Operator.IS_NULL:
        return new FilterOperator(Operator.IS_NULL);
      case Operator.NOT_NULL:
        return new FilterOperator(Operator.NOT_NULL);
      case Operator.IN:
        return new FilterOperator(Operator.IN);
      default:
        throw new ConflictException(`The filter operator ${value} is invalid`);
    }
  }

  public isPositive(): boolean {
    return this.value !== Operator.NOT_EQUAL && this.value !== Operator.NOT_CONTAINS;
  }

  protected throwErrorForInvalidValue(value: Operator): void {
    throw new ConflictException(`The filter operator ${value} is invalid`);
  }

  static equal() {
    return this.fromValue(Operator.EQUAL);
  }
}
