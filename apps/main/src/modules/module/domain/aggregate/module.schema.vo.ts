import Id from '@module-module/domain/aggregate/value-objects/id.vo';
import Name from '@module-module/domain/aggregate/value-objects/name.vo';
import Description from '@module-module/domain/aggregate/value-objects/description.vo';
import CreatedAt from '@module-module/domain/aggregate/value-objects/created-at.vo';
import DeletedAt from '@module-module/domain/aggregate/value-objects/deleted-at.vo';
import UpdatedAt from '@module-module/domain/aggregate/value-objects/updated-at.vo';
import IsEnabled from '@module-module/domain/aggregate/value-objects/is-enabled.vo';
import Project from '@module-module/domain/aggregate/value-objects/project.vo';
import { SubModule } from '@module-sub-module/domain/aggregate/sub-module';

export interface IModuleSchemaAggregate {
  id: Id;
  name: Name;
  description: Description;
  project: Project;
  subModules: SubModule[] & string[];
  actions?: string[];
  isEnabled: IsEnabled;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
  deletedAt?: DeletedAt;
}
