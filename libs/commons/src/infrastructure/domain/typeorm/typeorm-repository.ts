import { Criteria } from '@lib-commons/domain/criteria/criteria';
import { TypeormCriteriaConverter } from '@lib-commons/infrastructure/domain/typeorm/typeorm-criteria-converter';
import { Document } from 'typeorm';
import { MongoFindManyOptions } from 'typeorm/find-options/mongodb/MongoFindManyOptions';

// TODO: Handle this class to define all the common methods for the repositories
export abstract class TypeormRepository<T extends Document> extends TypeormCriteriaConverter<T> {
  protected getQueryByCriteria(criteria: Criteria): MongoFindManyOptions<T> {
    const query = this.convert(criteria);

    return query;
  }
}
