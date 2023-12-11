import { Inject, Injectable } from '@nestjs/common';
import { GetHealthQuery } from '@management-main/modules/health/application/use-cases/check-health/get-health.query';
import { IApplicationServiceQuery } from '@management-commons/application/application-service-query';
import { Health } from '@management-main/modules/health/domain/health';
import { EXTERNAL_SYSTEM } from '@management-main/modules/health/application/constants/injection-tokens';
import { IExternalSystem } from '@management-main/modules/health/domain/contracts/external-system';

@Injectable()
export class GetHealthService
  implements IApplicationServiceQuery<GetHealthQuery>
{
  constructor(
    @Inject(EXTERNAL_SYSTEM) private readonly externalSystem: IExternalSystem,
  ) {}

  async process(query: GetHealthQuery): Promise<Health> {
    const { url, name } = query;
    const health = new Health();

    health.pingWith(url, name);

    await this.externalSystem.connect(health);

    return health;
  }
}
