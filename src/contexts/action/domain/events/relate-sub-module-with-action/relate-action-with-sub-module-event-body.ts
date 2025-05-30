import { IEventBody } from '@core/domain/contracts/event/event-body';

export class RelateActionWithSubModuleEventBody implements IEventBody {
  actionId: string;

  subModules: string[];

  constructor(props: RelateActionWithSubModuleEventBody) {
    if (props !== undefined) {
      Object.assign(this, props);
    }
  }
}
