import { CreateActionCatalogService } from '@module-action/application/use-cases/action-catalog/create-action-catalog/create-action-catalog.service';
import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CreateActionCatalogInputDto } from '@module-action/infrastructure/controllers/action-catalog/create-action-catalog/presentation/create-action-catalog-input.dto';
import { CreateActionCatalogOutputDto, ICreateActionCatalogOutputDto } from '@module-action/infrastructure/controllers/action-catalog/create-action-catalog/presentation/create-action-catalog-output.dto';
import { CreateActionCatalogCommand } from '@module-action/application/use-cases/action-catalog/create-action-catalog/create-action-catalog.command';

@Controller('action-catalog')
export class CreateActionCatalogController {
  private readonly logger = new Logger(CreateActionCatalogController.name);

  constructor(private readonly createActionCatalogService: CreateActionCatalogService) {}

  @Post()
  async create(@Body() dto: CreateActionCatalogInputDto): Promise<ICreateActionCatalogOutputDto> {
    try {
      const createActionCatalogCommand = new CreateActionCatalogCommand(dto);
      const actionCatalog = await this.createActionCatalogService.process(createActionCatalogCommand);

      const createActionCatalogOutputDto = new CreateActionCatalogOutputDto(actionCatalog);

      return createActionCatalogOutputDto;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}