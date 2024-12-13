import { Controller, Logger } from '@nestjs/common';
import { CreateActionInputDto } from './presentation/create-action-input.dto';
import { CreateActionCommand } from '@module-action/application/use-cases/action/create-action/create-action.command';
import { ExceptionManager } from '@core/domain/exception-manager';
import { CreateActionService } from '@module-action/application/use-cases/action/create-action/create-action.service';
import {
  CreateActionOutputDto,
  ICreateActionOutputDto,
} from '@module-action/infrastructure/controllers/action/create-action/presentation/create-action-output.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class CreateActionController {
  private readonly logger = new Logger(CreateActionController.name);
  constructor(private readonly createSubModuleService: CreateActionService) {}

  @MessagePattern({ cmd: 'muses.action.create' })
  async create(@Payload() dto: CreateActionInputDto): Promise<ICreateActionOutputDto> {
    try {
      const command = new CreateActionCommand(dto);

      const action = await this.createSubModuleService.process(command);

      const mapper = new CreateActionOutputDto(action);

      return mapper;
    } catch (error) {
      this.logger.error(error);
      throw ExceptionManager.createSignatureError(error);
    }
  }
}
