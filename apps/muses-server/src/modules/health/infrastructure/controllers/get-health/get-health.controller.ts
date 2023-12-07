import { GetHealthService } from '@management-main/modules/health/application/use-cases/check-health/get-health.service';
import {
  BadRequestException,
  Controller,
  Get,
  HttpException,
  Logger,
  Query,
} from '@nestjs/common';
import { GetHealthInputDto } from '@management-main/modules/health/infrastructure/controllers/get-health/presentation/get-health-input.dto';
import { GetHealthQuery } from '@management-main/modules/health/application/use-cases/check-health/get-health.query';
import { GetHealthOutput } from '@management-main/modules/health/infrastructure/controllers/get-health/presentation/get-health-output.dto';
import { HealthCheck } from '@nestjs/terminus';

@Controller('management-health/')
export class HealthController {
  constructor(
    private readonly logger = new Logger(HealthController.name),
    private readonly getHeathService: GetHealthService,
  ) {}

  @Get('status/')
  @HealthCheck()
  async CheckHealth(@Query() queryParams: GetHealthInputDto): Promise<GetHealthOutput> {
    try {
      const query = new GetHealthQuery(queryParams);

      const health = await this.getHeathService.process(query);

      const output = new GetHealthOutput(health);

      return output;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      const err = error as Error;
      this.logger.error(err.message, err.stack);
      throw new BadRequestException(err.message, err.name);
    }
  }
}
