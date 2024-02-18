import { Inject, Injectable } from '@nestjs/common';
import { GetHealthQuery } from '@app-main/modules/health/application/use-cases/check-health/get-health.query';
import { EXTERNAL_SYSTEM } from '@app-main/modules/health/application/constants/injection-tokens';
import { IApplicationServiceQuery } from '@lib-commons/application/application-service-query';
import { Health } from '@app-main/modules/health/domain/health';
import { IExternalSystem } from '@app-main/modules/health/domain/contracts/external-system';

@Injectable()
export class GetHealthService implements IApplicationServiceQuery<GetHealthQuery> {
  constructor(@Inject(EXTERNAL_SYSTEM) private readonly externalSystem: IExternalSystem) {}

  async process(query: GetHealthQuery): Promise<Health> {
    const { url, name } = query;
    const health = new Health();

    health.pingWith(url, name);

    await this.externalSystem.connect(health);

    return health;
  }
}
