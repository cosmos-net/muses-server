import { IEventBody } from '@lib-commons/domain/contracts/event/event-body';

export class RelateSubModuleWithModuleEventBody implements IEventBody {
  subModuleId: string;

  moduleId: string;

  constructor(props: RelateSubModuleWithModuleEventBody) {
    if (props !== undefined) {
      Object.assign(this, props);
    }
  }
}
