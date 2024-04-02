import { IEventBody } from '@lib-commons/domain/contracts/event/event-body';

export class RemoveActionFromSubModulesEventBody implements IEventBody {
  actionId: string;

  subModules: string[];

  constructor(props: RemoveActionFromSubModulesEventBody) {
    if (props !== undefined) {
      Object.assign(this, props);
    }
  }
}
