import { Controller, Logger } from '@nestjs/common';
import { IListActionCatalogOutputDto, ListActionCatalogOutputDto } from '@module-action/infrastructure/controllers/action-catalog/list-action-catalog/presentation/create-action-catalog-output.dto';
import { ListActionCatalogService } from '@module-action/application/use-cases/action-catalog/list-action-catalog/list-action-catalog.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class ListActionCatalogController {
  private readonly logger = new Logger(ListActionCatalogController.name);

  constructor(private readonly listActionCatalogService: ListActionCatalogService) {}

  @MessagePattern({ cmd: 'muses.action.catalog.list' })
  async list(): Promise<IListActionCatalogOutputDto> {
      const actionCatalog = await this.listActionCatalogService.process();

      const listActionCatalogOutputDto = new ListActionCatalogOutputDto(actionCatalog.items);

      return listActionCatalogOutputDto;
    
  }
}
