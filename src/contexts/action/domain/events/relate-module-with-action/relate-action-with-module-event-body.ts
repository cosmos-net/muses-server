import { IEventBody } from '@core/domain/contracts/event/event-body';

export class RelateActionWithModuleEventBody implements IEventBody {
  actionId: string;

  modules: string[];

  constructor(props: RelateActionWithModuleEventBody) {
    if (props !== undefined) {
      Object.assign(this, props);
    }
  }
}
