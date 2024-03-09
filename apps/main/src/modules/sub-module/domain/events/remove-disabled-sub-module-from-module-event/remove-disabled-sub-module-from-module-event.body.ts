import { IEventBody } from '@lib-commons/domain/contracts/event/event-body';

export class RemoveDisabledSubModuleFromModuleEventBody implements IEventBody {
  subModuleId: string;

  moduleId: string;

  constructor(props: RemoveDisabledSubModuleFromModuleEventBody) {
    if (props !== undefined) {
      Object.assign(this, props);
    }
  }
}
