import { GetModuleService } from '@module-module/application/use-cases/get-module/get-module.service';
import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import {
  GetModuleOutputDto,
  IGetModuleOutputDto,
} from '@module-module/infrastructure/controllers/get-module/presentation/get-module-output.dto';
import { ExceptionManager } from '@lib-commons/domain/exception-manager';
import { GetModuleQuery } from '@app-main/modules/module/application/use-cases/get-module/get-module.query';

@Controller('module/')
export class GetModuleController {
  private readonly logger = new Logger(GetModuleController.name);
  constructor(private readonly getModuleService: GetModuleService) {}

  @Get('/:id')
  async Get(@Param('id') id: string, @Query('withDisabled') withDisabled: boolean): Promise<IGetModuleOutputDto> {
    try {
      const query = new GetModuleQuery({
        id,
        withDisabled,
        withProject: true,
      });

      const module = await this.getModuleService.process(query);

      const mapper = new GetModuleOutputDto(module);

      return mapper;
    } catch (error) {
      this.logger.error(error);
      throw ExceptionManager.createSignatureError(error);
    }
  }
}
