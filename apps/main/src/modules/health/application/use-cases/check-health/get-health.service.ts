import { Inject, Injectable } from '@nestjs/common';
import { GetHealthQuery, EXTERNAL_SYSTEM } from '@app-main/modules/health/application';
import { IApplicationServiceQuery } from '@lib-commons/application';
import { Health } from '@app-main/modules/health/domain/health';
import { IExternalSystem } from '@app-main/modules/health/domain';

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
