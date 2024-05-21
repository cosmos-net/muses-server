import { IEventBody } from '@core/domain/contracts/event/event-body';

export class UpdateRelationsWithSubModulesEventBody implements IEventBody {
  actionId: string;

  legacySubModules: string[];

  newSubModules: string[];

  constructor(props: UpdateRelationsWithSubModulesEventBody) {
    if (props !== undefined) {
      Object.assign(this, props);
    }
  }
}
