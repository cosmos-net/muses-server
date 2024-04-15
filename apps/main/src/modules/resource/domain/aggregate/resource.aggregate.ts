import Id from '@module-resource/domain/aggregate/value-objects/id.vo';
import Name from '@module-resource/domain/aggregate/value-objects/name.vo';
import Description from '@module-resource/domain/aggregate/value-objects/description.vo';
import CreatedAt from '@module-resource/domain/aggregate/value-objects/created-at.vo';
import DeletedAt from '@module-resource/domain/aggregate/value-objects/deleted-at.vo';
import UpdatedAt from '@module-resource/domain/aggregate/value-objects/updated-at.vo';
import IsEnabled from '@module-resource/domain/aggregate/value-objects/is-enabled.vo';
import Endpoint from '@module-resource/domain/aggregate/value-objects/endpoint.vo';
import Method from '@module-resource/domain/aggregate/value-objects/method.vo';
import { Action } from '@module-action/domain/aggregate/action';
import { Resource } from '@module-resource/domain/aggregate/resource';

export interface IActionSchemaAggregate {
  id: Id;
  name: Name;
  description: Description;
  isEnabled: IsEnabled;
  endpoint: Endpoint;
  method: Method;
  triggers?: (Resource[] & string[]) | null;
  actions: Action[] & string[];
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
  deletedAt?: DeletedAt | null;
}
