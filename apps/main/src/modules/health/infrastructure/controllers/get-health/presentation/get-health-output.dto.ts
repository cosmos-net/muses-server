import {
  Health,
  HealthSchema,
} from '@app-main/modules/health/domain/health';
import { HealthCheckStatus, HealthIndicatorResult } from '@nestjs/terminus';

export class GetHealthOutput implements HealthSchema {
  readonly status: HealthCheckStatus;
  readonly details: HealthIndicatorResult;
  readonly error: HealthIndicatorResult | undefined;
  readonly info: HealthIndicatorResult | undefined;
  readonly version: string;
  readonly uptime: number;
  readonly timestamp: string;
  readonly url: string;
  readonly name: string;

  constructor(health: Health) {
    this.status = health.status;
    this.details = health.details;
    this.error = health.error;
    this.info = health.info;
    this.version = health.version;
    this.uptime = health.uptime;
    this.timestamp = health.timestamp;
    this.url = health.url;
    this.name = health.name;
  }
}
