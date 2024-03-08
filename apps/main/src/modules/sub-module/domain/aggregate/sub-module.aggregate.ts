import Id from '@module-sub-module/domain/aggregate/value-objects/id.vo';
import Name from '@module-sub-module/domain/aggregate/value-objects/name.vo';
import Description from '@module-sub-module/domain/aggregate/value-objects/description.vo';
import CreatedAt from '@module-sub-module/domain/aggregate/value-objects/created-at.vo';
import DeletedAt from '@module-sub-module/domain/aggregate/value-objects/deleted-at.vo';
import UpdatedAt from '@module-sub-module/domain/aggregate/value-objects/updated-at.vo';
import IsEnabled from '@module-sub-module/domain/aggregate/value-objects/is-enabled.vo';
import { Module } from '@module-module/domain/aggregate/module';

export interface ISubModuleSchemaAggregate {
  id: Id;
  name: Name;
  description: Description;
  module: Module | string;
  isEnabled: IsEnabled;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
  deletedAt?: DeletedAt;
}
