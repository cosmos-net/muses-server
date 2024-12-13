import { Controller, Logger } from '@nestjs/common';
import { GetActionCatalogInputDto } from '@module-action/infrastructure/controllers/action-catalog/get-action-catalog/presentation/get-action-catalog-input.dto';
import { GetActionCatalogOutputDto, IGetActionCatalogOutputDto } from '@module-action/infrastructure/controllers/action-catalog/get-action-catalog/presentation/get-action-catalog-output.dto';
import { GetActionCatalogQuery } from '@module-action/application/use-cases/action-catalog/get-action-catalog/get-action-catalog.command';
import { GetActionCatalogService } from '@module-action/application/use-cases/action-catalog/get-action-catalog/get-action-catalog.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class GetActionCatalogController {
  private readonly logger = new Logger(GetActionCatalogController.name);

  constructor(private readonly getActionCatalogService: GetActionCatalogService) {}

  @MessagePattern({ cmd: 'muses.action.catalog.get' })
  async get(@Payload() dto: GetActionCatalogInputDto): Promise<IGetActionCatalogOutputDto> {
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
