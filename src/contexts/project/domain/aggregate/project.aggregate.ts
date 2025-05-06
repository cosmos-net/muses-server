import Id from '@module-project/domain/aggregate/value-objects/id.vo';
import Name from '@module-project/domain/aggregate/value-objects/name.vo';
import Description from '@module-project/domain/aggregate/value-objects/description.vo';
import IsEnabled from '@module-project/domain/aggregate/value-objects/is-enabled.vo';
import CreatedAt from '@module-project/domain/aggregate/value-objects/created-at.vo';
import UpdatedAt from '@module-project/domain/aggregate/value-objects/updated-at.vo';
import DeletedAt from '@module-project/domain/aggregate/value-objects/deleted-at.vo';
import { Ecosystem } from '@context-ecosystem/domain/aggregate/ecosystem';
import { Module } from '@module-module/domain/aggregate/module';

export interface IProjectAggregate {
  id: Id;
  name: Name;
  description: Description;
  ecosystem?: string | Ecosystem;
  isEnabled: IsEnabled;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
  deletedAt?: DeletedAt;
  modules: (string | Module)[];
}
