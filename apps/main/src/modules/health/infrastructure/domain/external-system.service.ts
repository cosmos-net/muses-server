import { IExternalSystem } from '@management-main/modules/health/domain/contracts/external-system';
import { Health } from '@management-main/modules/health/domain/health';
import { Injectable } from '@nestjs/common';
import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';

@Injectable()
export class ExternalSystemService implements IExternalSystem {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
  ) {}

  async connect(model: Health): Promise<Health> {
    const { url, name } = model;

    const result = await this.health.check([
      () => this.http.pingCheck(name, url),
    ]);

    model.reportPingCheck(result);

    return model;
  }
}
