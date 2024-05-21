import { GetSubModuleService } from '@module-sub-module/application/use-cases/get-sub-module/get-sub-module.service';
import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { ExceptionManager } from '@core/domain/exception-manager';
import {
  GetSubModuleOutputDto,
  IGetSubModuleOutputDto,
} from '@module-sub-module/infrastructure/controllers/get-sub-module/presentation/get-sub-module-output.dto';
import { GetSubModuleQuery } from '@module-sub-module/application/use-cases/get-sub-module/get-sub-module.query';

@Controller('sub-module/')
export class GetSubModuleController {
  private readonly logger = new Logger(GetSubModuleController.name);
  constructor(private readonly getSubModuleService: GetSubModuleService) {}

  @Get('/:id')
  async Get(@Param('id') id: string, @Query('withDisabled') withDisabled: boolean): Promise<IGetSubModuleOutputDto> {
    try {
      const query = new GetSubModuleQuery({
        id,
        withDisabled,
      });

      const module = await this.getSubModuleService.process(query);

      const mapper = new GetSubModuleOutputDto(module);

      return mapper;
    } catch (error) {
      this.logger.error(error);
      throw ExceptionManager.createSignatureError(error);
    }
  }
}
