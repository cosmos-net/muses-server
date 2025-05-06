import Id from '@context-ecosystem/domain/aggregate/value-objects/id.vo';
import Name from '@context-ecosystem/domain/aggregate/value-objects/name.vo';
import Description from '@context-ecosystem/domain/aggregate/value-objects/description.vo';
import IsEnabled from '@context-ecosystem/domain/aggregate/value-objects/is-enabled.vo';
import CreatedAt from '@context-ecosystem/domain/aggregate/value-objects/created-at.vo';
import UpdatedAt from '@context-ecosystem/domain/aggregate/value-objects/updated-at.vo';
import DeletedAt from '@context-ecosystem/domain/aggregate/value-objects/deleted-at.vo';

export interface IEcosystemSchemaValueObject {
  id: Id;
  name: Name;
  description: Description;
  isEnabled: IsEnabled;
  projects: string[] | any[];
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
  deletedAt?: DeletedAt | null;
}
