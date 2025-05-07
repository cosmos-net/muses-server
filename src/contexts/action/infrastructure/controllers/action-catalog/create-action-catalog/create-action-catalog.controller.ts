import { CreateActionCatalogService } from '@module-action/application/use-cases/action-catalog/create-action-catalog/create-action-catalog.service';
import { Controller, Logger } from '@nestjs/common';
import { CreateActionCatalogInputDto } from '@module-action/infrastructure/controllers/action-catalog/create-action-catalog/presentation/create-action-catalog-input.dto';
import { CreateActionCatalogOutputDto, ICreateActionCatalogOutputDto } from '@module-action/infrastructure/controllers/action-catalog/create-action-catalog/presentation/create-action-catalog-output.dto';
import { CreateActionCatalogCommand } from '@module-action/application/use-cases/action-catalog/create-action-catalog/create-action-catalog.command';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class CreateActionCatalogController {
  private readonly logger = new Logger(CreateActionCatalogController.name);

  constructor(private readonly createActionCatalogService: CreateActionCatalogService) {}

  @MessagePattern({ cmd: 'MUSES.ACTION.CATALOG.CREATE' })
  async create(@Payload() dto: CreateActionCatalogInputDto): Promise<ICreateActionCatalogOutputDto> {
      const createActionCatalogCommand = new CreateActionCatalogCommand(dto);
      const actionCatalog = await this.createActionCatalogService.process(createActionCatalogCommand);

      const createActionCatalogOutputDto = new CreateActionCatalogOutputDto(actionCatalog);

      return createActionCatalogOutputDto;
    
  }
}