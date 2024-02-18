import { GetHealthService } from '@app-main/modules/health/application/use-cases/check-health/get-health.service';
import { Controller, Get, Logger, Query } from '@nestjs/common';
import { GetHealthInputDto } from '@app-main/modules/health/infrastructure/controllers/get-health/presentation/get-health-input.dto';
import { GetHealthQuery } from '@app-main/modules/health/application/use-cases/check-health/get-health.query';
import { GetHealthOutput } from '@app-main/modules/health/infrastructure/controllers/get-health/presentation/get-health-output.dto';
import { HealthCheck } from '@nestjs/terminus';
import { ExceptionManager } from '@lib-commons/domain/exception-manager';

@Controller('management-health/')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);
  constructor(private readonly getHeathService: GetHealthService) {}

  @Get('status/')
  @HealthCheck()
  async CheckHealth(@Query() queryParams: GetHealthInputDto): Promise<GetHealthOutput> {
    try {
      const query = new GetHealthQuery(queryParams);

      const health = await this.getHeathService.process(query);

      const output = new GetHealthOutput(health);

      return output;
    } catch (error) {
      this.logger.error(error);
      throw ExceptionManager.createSignatureError(error);
    }
  }
}
