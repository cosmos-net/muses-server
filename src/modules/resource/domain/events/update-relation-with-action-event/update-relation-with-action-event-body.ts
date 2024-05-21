import { IEventBody } from '@core/domain/contracts/event/event-body';

export class UpdateRelationsWithActionEventBody implements IEventBody {
  actionsToAddResource: string[];

  actionsToRemoveResource: string[];

  resourceId: string;

  constructor(props: UpdateRelationsWithActionEventBody) {
    if (props !== undefined) {
      Object.assign(this, props);
    }
  }
}
