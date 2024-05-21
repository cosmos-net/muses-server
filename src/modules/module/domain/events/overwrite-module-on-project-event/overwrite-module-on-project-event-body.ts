import { IEventBody } from '@core/domain/contracts/event/event-body';

export class OverwriteModuleOnProjectEventBody implements IEventBody {
  moduleId: string;

  previousProjectId: string;

  newProjectId: string;

  constructor(props: OverwriteModuleOnProjectEventBody) {
    if (props !== undefined) {
      Object.assign(this, props);
    }
  }
}
