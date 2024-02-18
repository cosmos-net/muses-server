import { Health } from '@app-main/modules/health/domain/health';

export interface IExternalSystem {
  connect(model: Health): Promise<Health>;
}
