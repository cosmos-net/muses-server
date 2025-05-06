import { IEventBody } from '@core/domain/contracts/event/event-body';

export class OverwriteSubModuleOnModuleEventBody implements IEventBody {
  subModuleId: string;

  previousModuleId: string;

  newModuleId: string;

  constructor(props: OverwriteSubModuleOnModuleEventBody) {
    if (props !== undefined) {
      Object.assign(this, props);
    }
  }
}
