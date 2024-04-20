import { IEventBody } from '@lib-commons/domain/contracts/event/event-body';

export class UpdateRelationsWithEcosystemEventBody implements IEventBody {
  ecosystemToRelateProject: string;

  ecosystemToUnRelateProject: string;

  projectId: string;

  constructor(props: UpdateRelationsWithEcosystemEventBody) {
    if (props !== undefined) {
      Object.assign(this, props);
    }
  }
}
