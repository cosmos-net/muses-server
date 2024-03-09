/* eslint-disable hexagonal-architecture/enforce */
import { ModuleEntity } from '@module-module/infrastructure/domain/module-muses.entity';
import { SubModuleEntity } from '@module-sub-module/infrastructure/domain/sub-module-muses.entity';
import { EcosystemEntity } from '@module-eco/infrastructure/domain/ecosystem-muses.entity';
import { ProjectEntity } from '@module-project/infrastructure/domain/project-muses.entity';

export const entities = [EcosystemEntity, ProjectEntity, ModuleEntity, SubModuleEntity];
