import { Health } from '@app-main/modules/health/domain';

export interface IExternalSystem {
  connect(model: Health): Promise<Health>;
}
