import { Criteria } from '@core/domain/criteria/criteria';
import { Filters } from '@core/domain/criteria/filters';
import { Filter } from '@core/domain/criteria/filter';
import { Order } from '@core/domain/criteria/order';
import { IsNull, LessThan, Like, MoreThan, Not, Document, FindOptionsOrder, FindOptionsWhere } from 'typeorm';
import { Operator } from '@core/domain/criteria/filter-operator';
import { MongoFindManyOptions } from 'typeorm/find-options/mongodb/MongoFindManyOptions';
import { regexHexObjectId } from '@core/infrastructure/helpers/regex';
import { ObjectId } from 'mongodb';

type TransformerFunctionType<T, K> = (value: T) => K;

export class TypeormCriteriaConverter<T extends Document> {
  private filterTransformers: Map<Operator, TransformerFunctionType<Filter, FindOptionsWhere<T>>>;

  constructor() {
    this.filterTransformers = new Map<Operator, TransformerFunctionType<Filter, FindOptionsWhere<T>>>([
      [Operator.EQUAL, this.equalFilter],
      [Operator.NOT_EQUAL, this.notEqualFilter],
      [Operator.GT, this.greaterThanFilter],
      [Operator.LT, this.lessThanFilter],
      [Operator.CONTAINS, this.containsFilter],
      [Operator.NOT_CONTAINS, this.notContainsFilter],
      [Operator.STARTS_WITH, this.startsWithFilter],
      [Operator.ENDS_WITH, this.endsWithFilter],
      [Operator.GTE, this.greaterThanOrEqualFilter],
      [Operator.LTE, this.lessThanOrEqualFilter],
      [Operator.IN, this.inFilter],
      [Operator.IS_NULL, this.isNullFilter],
      [Operator.NOT_NULL, this.notNullFilter],
    ]);
  }

  public convert(criteria: Criteria): MongoFindManyOptions<T> {
    const options: MongoFindManyOptions<T> = {};

    options.skip = criteria.offset;
    options.take = criteria.limit;

    if (criteria.hasFilters()) {
      options.where = this.generateFilters(criteria.filters);
    }

    if (criteria.hasOrder()) {
      options.order = this.generateSort(criteria.order);
    }

    if (criteria.withDeleted) {
      options.withDeleted = true;
    }

    return options;
  }

  protected generateFilters(filters: Filters): FindOptionsWhere<T>[] {
    const filtersGenerated: FindOptionsWhere<T>[] = [];

    filters.filters.forEach((filter) => {
      const transformer = this.filterTransformers.get(filter.operator.value);

      if (!transformer) {
        throw Error(`Unexpected operator value ${filter.operator.value}`);
      }

      const transformerGenerated = transformer(filter);
      let isMatchKey = false;

      const currentKey = Object.keys(transformerGenerated)[0];
      for (let index = 0; index < filtersGenerated.length; index += 1) {
        Object.keys(filtersGenerated[index]).forEach((key) => {
          if (key === currentKey) {
            isMatchKey = true;
            const subKey = Object.keys(filtersGenerated[index])[0];
            const subValue = Object.values(filtersGenerated[index])[0];
            const newSubValue = { ...subValue, ...transformerGenerated[currentKey] };
            filtersGenerated[index] = { [subKey]: newSubValue } as FindOptionsWhere<T>;
          }
        });
      }

      if (!isMatchKey) {
        filtersGenerated.push(transformerGenerated);
      }
    });

    return Object.assign({}, ...filtersGenerated);
  }

  protected generateSort(order: Order): FindOptionsOrder<T> {
    return {
      [order.orderBy.value === 'id' ? '_id' : order.orderBy.value]: order.orderType.isAsc() ? 'ASC' : 'DESC',
    } as FindOptionsOrder<T>;
  }

  private equalFilter(filter: Filter): FindOptionsWhere<T> {
    const field = filter.field.value as keyof T;
    const value = filter.value.value;

    return { [field]: value } as FindOptionsWhere<T>;
  }

  private notEqualFilter(filter: Filter): FindOptionsWhere<T> {
    return { [filter.field.value]: Not(filter.getValue()) } as FindOptionsWhere<T>;
  }

  private containsFilter(filter: Filter): FindOptionsWhere<T> {
    const field = filter.field.value as keyof T;
    const value = filter.getValue() as string;

    return {
      [field]: {
        $regex: value,
        $options: 'i',
      },
    } as FindOptionsWhere<T>;
  }

  private startsWithFilter(filter: Filter): FindOptionsWhere<T> {
    const field = filter.field.value as keyof T;
    const value = filter.getValue() as string;

    return {
      [field]: {
        $regex: `^${value}`,
        $options: 'i',
      },
    } as FindOptionsWhere<T>;
  }

  private endsWithFilter(filter: Filter): FindOptionsWhere<T> {
    const field = filter.field.value as keyof T;
    const value = filter.getValue() as string;

    return {
      [field]: {
        $regex: `${value}$`,
        $options: 'i',
      },
    } as FindOptionsWhere<T>;
  }

  private greaterThanFilter(filter: Filter): FindOptionsWhere<T> {
    return { [filter.field.value]: MoreThan(filter.getValue()) } as FindOptionsWhere<T>;
  }

  private lessThanFilter(filter: Filter): FindOptionsWhere<T> {
    return { [filter.field.value]: LessThan(filter.getValue()) } as FindOptionsWhere<T>;
  }

  private inFilter(filter: Filter): FindOptionsWhere<T> {
    const filterValue = filter.getValue();

    if (
      typeof filterValue === 'string' ||
      typeof filterValue === 'number' ||
      typeof filterValue === 'boolean' ||
      filterValue instanceof Date
    ) {
      throw new Error('The value of the filter must be an array');
    }

    if (!Array.isArray(filterValue)) {
      throw new Error('The value of the filter must be an array');
    }

    let isValueObjectIds = true;
    for (const key in filterValue) {
      const value = filterValue[key];
      if (typeof value === 'string') {
        if (
          !regexHexObjectId.opt1.test(value) &&
          !regexHexObjectId.opt2.test(value) &&
          !regexHexObjectId.opt3.test(value)
        ) {
          isValueObjectIds = false;
          break;
        }
      }
    }

    const inFilters = isValueObjectIds ? filterValue.map((value) => new ObjectId(value)) : filterValue;

    return { [filter.field.value]: { $in: inFilters } } as FindOptionsWhere<T>;
  }

  private greaterThanOrEqualFilter(filter: Filter): FindOptionsWhere<T> {
    const isDate = typeof filter.value.value === 'string' && !isNaN(new Date(filter.value.value).getDate());
    let dateServerValue: Date = new Date();

    if (isDate) {
      const pivotDate = new Date(filter.value.value).toLocaleString('en-US', {
        timeZone: 'America/Tijuana',
      });

      const dateClient = new Date(new Date(pivotDate).setHours(0, 0, 0, 0));

      dateServerValue = new Date(
        Date.UTC(
          dateClient.getFullYear(),
          dateClient.getMonth(),
          dateClient.getDate(),
          dateClient.getHours(),
          dateClient.getMinutes(),
          dateClient.getSeconds(),
          dateClient.getMilliseconds(),
        ),
      );
    }

    const field = filter.field.value;
    const filters = {
      [field]: {
        $gte: isDate ? dateServerValue : filter.value.value,
      },
    };

    return filters as FindOptionsWhere<T>;
  }

  private lessThanOrEqualFilter(filter: Filter): FindOptionsWhere<T> {
    const isDate = typeof filter.value.value === 'string' && !isNaN(new Date(filter.value.value).getDate());
    let dateServerValue: Date = new Date();

    if (isDate) {
      const pivotDate = new Date(filter.value.value).toLocaleString('en-US', {
        timeZone: 'America/Tijuana',
      });

      const dateClient = new Date(new Date(pivotDate).setHours(23, 59, 59, 999));

      dateServerValue = new Date(
        Date.UTC(
          dateClient.getFullYear(),
          dateClient.getMonth(),
          dateClient.getDate(),
          dateClient.getHours(),
          dateClient.getMinutes(),
          dateClient.getSeconds(),
          dateClient.getMilliseconds(),
        ),
      );
    }

    const field = filter.field.value;
    const filters = {
      [field]: {
        $lte: isDate ? dateServerValue : filter.value.value,
      },
    };

    return filters as FindOptionsWhere<T>;
  }

  private isNullFilter(filter: Filter): FindOptionsWhere<T> {
    return { [filter.field.value]: IsNull() } as FindOptionsWhere<T>;
  }

  private notNullFilter(filter: Filter): FindOptionsWhere<T> {
    return { [filter.field.value]: Not(IsNull()) } as FindOptionsWhere<T>;
  }

  private notContainsFilter(filter: Filter): FindOptionsWhere<T> {
    return { [filter.field.value]: Not(Like(`%${filter.getValue()}%`)) } as FindOptionsWhere<T>;
  }
}
