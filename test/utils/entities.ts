/* eslint-disable hexagonal-architecture/enforce */
import { ModuleEntity } from '@module-module/infrastructure/domain/module-muses.entity';
import { SubModuleEntity } from '@module-sub-module/infrastructure/domain/sub-module-muses.entity';
import { EcosystemEntity } from '@context-ecosystem/infrastructure/domain/ecosystem-muses.entity';
import { ProjectEntity } from '@module-project/infrastructure/domain/project-muses.entity';
import { ActionEntity } from '@module-action/infrastructure/domain/action-muses.entity';
import { ResourceEntity } from '@module-resource/infrastructure/domain/resources-muses.entity';

export const entities = [EcosystemEntity, ProjectEntity, ModuleEntity, SubModuleEntity, ActionEntity, ResourceEntity];
