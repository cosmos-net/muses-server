import { HealthCheckResult, HealthCheckStatus, HealthIndicatorResult } from '@nestjs/terminus';

export interface HealthSchema {
  status: HealthCheckStatus;
  details: HealthIndicatorResult;
  error: HealthIndicatorResult;
  info: HealthIndicatorResult;
  version: string;
  uptime: number;
  timestamp: string;
  url: string;
  name: string;
}

export class Health {
  constructor(schema?: HealthSchema) {
    this._entityRoot.version = schema.version || 'v1.0.0';
    this._entityRoot.uptime = schema.uptime || 9999;
    this._entityRoot.timestamp = schema.timestamp || '2021-01-01';
    this._entityRoot.url = schema.url || '';
    this._entityRoot.name = schema.name || '';
  }
  private _entityRoot: HealthSchema;


  public get details(): HealthIndicatorResult {
    return this._entityRoot.details;
  }

  public get error(): HealthIndicatorResult {
    return this._entityRoot.error;
  }

  public get info(): HealthIndicatorResult {
    return this._entityRoot.info;
  }

  public get status(): HealthCheckStatus {
    return this._entityRoot.status;
  }

  public hydrate(entityRoot: HealthSchema): void {
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
    if (this._entityRoot.url.trim().length === 0) {
      throw new Error('Url is required');
    }

    if (this._entityRoot.name.trim().length === 0) {
      throw new Error('Name is required');
    }

    this._entityRoot.url = url;
    this._entityRoot.name = name;
  }

  public reportPingCheck(result: HealthCheckResult): void {
    const { details, status, error, info } = result

    this._entityRoot.status = status;
    this._entityRoot.details = details;
    this._entityRoot.error = error;
    this._entityRoot.info = info;
    
  }
}
