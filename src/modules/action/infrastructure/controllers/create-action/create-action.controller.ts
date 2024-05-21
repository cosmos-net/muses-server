import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CreateActionInputDto } from './presentation/create-action-input.dto';
import { CreateActionCommand } from '@module-action/application/use-cases/create-action/create-action.command';
import { ExceptionManager } from '@core/domain/exception-manager';
import { CreateActionService } from '@module-action/application/use-cases/create-action/create-action.service';
import {
  CreateActionOutputDto,
  ICreateActionOutputDto,
} from '@module-action/infrastructure/controllers/create-action/presentation/create-action-output.dto';

@Controller('/action')
export class CreateActionController {
  private readonly logger = new Logger(CreateActionController.name);
  constructor(private readonly createSubModuleService: CreateActionService) {}

  @Post()
  async create(@Body() dto: CreateActionInputDto): Promise<ICreateActionOutputDto> {
    try {
      const command = new CreateActionCommand({
        name: dto.name,
        description: dto.description,
        modules: dto.modules,
        subModules: dto.subModules,
      });

      const action = await this.createSubModuleService.process(command);

      const mapper = new CreateActionOutputDto(action);

      return mapper;
    } catch (error) {
      this.logger.error(error);
      throw ExceptionManager.createSignatureError(error);
    }
  }
}
