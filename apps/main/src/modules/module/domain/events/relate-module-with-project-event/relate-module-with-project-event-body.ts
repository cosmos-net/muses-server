import { IEventBody } from '@lib-commons/domain/contracts/event/event-body';

export class RelateModuleWithProjectEventBody implements IEventBody {
  moduleId: string;

  projectId: string;

  constructor(props: RelateModuleWithProjectEventBody) {
    if (props !== undefined) {
      Object.assign(this, props);
    }
  }
}
