import { IEventBody } from '@lib-commons/domain/contracts/event/event-body';

export class UpdateRelationsWithModulesEventBody implements IEventBody {
  actionId: string;

  legacyModules: string[];

  newModules: string[];

  constructor(props: UpdateRelationsWithModulesEventBody) {
    if (props !== undefined) {
      Object.assign(this, props);
    }
  }
}
