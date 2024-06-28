import { Controller, Get, Logger } from '@nestjs/common';
import { IListActionCatalogOutputDto, ListActionCatalogOutputDto } from '@module-action/infrastructure/controllers/action-catalog/list-action-catalog/presentation/create-action-catalog-output.dto';
import { ListActionCatalogService } from '@module-action/application/use-cases/action-catalog/list-action-catalog/list-action-catalog.service';

@Controller('action-catalog/')
export class ListActionCatalogController {
  private readonly logger = new Logger(ListActionCatalogController.name);

  constructor(private readonly listActionCatalogService: ListActionCatalogService) {}

  @Get('list/')
  async list(): Promise<IListActionCatalogOutputDto> {
    try {
      const actionCatalog = await this.listActionCatalogService.process();

      const listActionCatalogOutputDto = new ListActionCatalogOutputDto(actionCatalog.items);

      return listActionCatalogOutputDto;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
