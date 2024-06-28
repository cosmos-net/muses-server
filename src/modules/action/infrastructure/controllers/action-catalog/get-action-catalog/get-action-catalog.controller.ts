import { Body, Controller, Get, Logger } from '@nestjs/common';
import { GetActionCatalogInputDto } from '@module-action/infrastructure/controllers/action-catalog/get-action-catalog/presentation/get-action-catalog-input.dto';
import { GetActionCatalogOutputDto, IGetActionCatalogOutputDto } from '@module-action/infrastructure/controllers/action-catalog/get-action-catalog/presentation/get-action-catalog-output.dto';
import { GetActionCatalogQuery } from '@module-action/application/use-cases/action-catalog/get-action-catalog/get-action-catalog.command';
import { GetActionCatalogService } from '@module-action/application/use-cases/action-catalog/get-action-catalog/get-action-catalog.service';

@Controller('action-catalog')
export class GetActionCatalogController {
  private readonly logger = new Logger(GetActionCatalogController.name);

  constructor(private readonly getActionCatalogService: GetActionCatalogService) {}

  @Get()
  async get(@Body() dto: GetActionCatalogInputDto): Promise<IGetActionCatalogOutputDto> {
    try {
      const getActionCatalogQuery = new GetActionCatalogQuery(dto);
      const actionCatalog = await this.getActionCatalogService.process(getActionCatalogQuery);

      const getActionCatalogOutputDto = new GetActionCatalogOutputDto(actionCatalog);

      return getActionCatalogOutputDto;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
