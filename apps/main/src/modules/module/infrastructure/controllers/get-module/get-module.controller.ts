import { GetModuleService } from '@module-module/application/use-cases/get-module/get-module.service';
import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import {
  GetModuleOutputDto,
  IGetModuleOutputDto,
} from '@module-module/infrastructure/controllers/get-module/presentation/get-module-output.dto';
import { GetProjectQuery } from '@module-project/application/use-cases/get-project/get-project.query';
import { ExceptionManager } from '@lib-commons/domain/exception-manager';

@Controller('module/')
export class GetModuleController {
  private readonly logger = new Logger(GetModuleController.name);
  constructor(private readonly getModuleService: GetModuleService) {}

  @Get('/:id')
  async Get(@Param('id') id: string, @Query('withDisabled') withDisabled: boolean): Promise<IGetModuleOutputDto> {
    try {
      const query = new GetProjectQuery({
        id,
        withDisabled,
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
