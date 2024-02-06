import Id from '@module-eco/domain/aggregate/value-objects/id.vo';
import Name from '@module-eco/domain/aggregate/value-objects/name.vo';
import Description from '@module-eco/domain/aggregate/value-objects/description.vo';
import IsEnabled from '@module-eco/domain/aggregate/value-objects/is-enabled.vo';
import CreatedAt from '@module-eco/domain/aggregate/value-objects/created-at.vo';
import UpdatedAt from '@module-eco/domain/aggregate/value-objects/updated-at.vo';
import DeletedAt from '@module-eco/domain/aggregate/value-objects/deleted-at.vo';

export interface IEcosystemSchemaValueObject {
  id: Id;
  name: Name;
  description: Description;
  isEnabled: IsEnabled;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
  deletedAt: DeletedAt;
}
