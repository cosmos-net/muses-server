import Id from '@module-action/domain/aggregate/value-objects/id.vo';
import Name from '@module-action/domain/aggregate/value-objects/name.vo';
import Description from '@module-action/domain/aggregate/value-objects/description.vo';
import CreatedAt from '@module-action/domain/aggregate/value-objects/created-at.vo';
import DeletedAt from '@module-action/domain/aggregate/value-objects/deleted-at.vo';
import UpdatedAt from '@module-action/domain/aggregate/value-objects/updated-at.vo';
import IsEnabled from '@module-action/domain/aggregate/value-objects/is-enabled.vo';
import { Module } from '@module-module/domain/aggregate/module';
import { SubModule } from '@module-sub-module/domain/aggregate/sub-module';
import { ActionCatalog } from '@module-action/domain/aggregate/action-catalog';

export interface IActionSchemaAggregate {
  id: Id;
  name: Name;
  description: Description;
  isEnabled: IsEnabled;
  module: Module | string;
  submodule?: SubModule | string | null;
  resource: string | null;
  actionCatalog: ActionCatalog;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
  deletedAt?: DeletedAt;
}
