import { HealthCheckResult, HealthCheckStatus, HealthIndicatorResult } from '@nestjs/terminus';

export interface IHealthSchema {
  status: HealthCheckStatus;
  details: HealthIndicatorResult;
  error?: HealthIndicatorResult;
  info?: HealthIndicatorResult;
  version: string;
  uptime: number;
  timestamp: string;
  url: string;
  name: string;
}

export class Health {
  private _entityRoot = {} as IHealthSchema;

  constructor(schema?: IHealthSchema) {
    if (schema) {
      this._entityRoot.version = schema.version || 'v1.0.0';
      this._entityRoot.uptime = schema.uptime || 9999;
      this._entityRoot.timestamp = schema.timestamp || '2021-01-01';
    } else {
      this._entityRoot.version = 'v1.0.0';
      this._entityRoot.uptime = 9999;
      this._entityRoot.timestamp = '2021-01-01';
    }
  }

  public get details(): HealthIndicatorResult {
    return this._entityRoot.details;
  }

  public get error(): HealthIndicatorResult | undefined {
    return this._entityRoot.error;
  }

  public get info(): HealthIndicatorResult | undefined {
    return this._entityRoot.info;
  }

  public get status(): HealthCheckStatus {
    return this._entityRoot.status;
  }

  public hydrate(entityRoot: IHealthSchema): void {
    this._entityRoot = entityRoot;
  }

  public get version(): string {
    return this._entityRoot.version;
  }

  public get uptime(): number {
    return this._entityRoot.uptime;
  }

  public get timestamp(): string {
    return this._entityRoot.timestamp;
  }

  public get url(): string {
    return this._entityRoot.url;
  }

  public get name(): string {
    return this._entityRoot.name;
  }

  public pingWith(url: string, name: string): void {
    if (url.trim().length === 0) {
      throw new Error('Url is required');
    }

    if (name.trim().length === 0) {
      throw new Error('Name is required');
    }

    this._entityRoot.url = url;
    this._entityRoot.name = name;
  }

  public reportPingCheck(result: HealthCheckResult): void {
    const { details, status, error, info } = result;

    this._entityRoot.status = status;
    this._entityRoot.details = details;
    this._entityRoot.error = error;
    this._entityRoot.info = info;
  }
}
