import { GetResourceService } from '@module-resource/application/use-cases/get-resource/get-resource.service';
import { GetResourceQuery } from '@module-resource/application/use-cases/get-resource/get-resource.query';
import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { ExceptionManager } from '@core/domain/exception-manager';
import {
  GetResourceOutputDto,
  IGetResourceOutputDto,
} from '@module-resource/infrastructure/controllers/get-resource/presentation/get-resource-output.dto';

@Controller('/resource')
export class GetResourceController {
  private readonly logger = new Logger(GetResourceController.name);

  constructor(private readonly getResourceService: GetResourceService) {}

  @Get('/:id')
  async Get(@Param('id') id: string, @Query('withDisabled') withDisabled: boolean): Promise<IGetResourceOutputDto> {
    try {
      const query = new GetResourceQuery({
        id,
        withDisabled,
      });

      const resource = await this.getResourceService.process(query);

      const mapper = new GetResourceOutputDto(resource);

      return mapper;
    } catch (error) {
      this.logger.error(error);
      throw ExceptionManager.createSignatureError(error);
    }
  }
}
