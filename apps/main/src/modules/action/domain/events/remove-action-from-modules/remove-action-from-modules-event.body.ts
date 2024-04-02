import { IEventBody } from '@lib-commons/domain/contracts/event/event-body';

export class RemoveActionFromModulesEventBody implements IEventBody {
  actionId: string;

  modules: string[];

  constructor(props: RemoveActionFromModulesEventBody) {
    if (props !== undefined) {
      Object.assign(this, props);
    }
  }
}
