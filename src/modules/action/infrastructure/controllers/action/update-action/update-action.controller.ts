import { UpdateActionService } from '@module-action/application/use-cases/action/update-action/update-action.service';
import { Controller, Logger } from '@nestjs/common';
import { UpdateActionInputDto } from '@module-action/infrastructure/controllers/action/update-action/presentation/update-action-input.dto';
import { UpdateActionCommand } from '@module-action/application/use-cases/action/update-action/update-action.command';
import { UpdateActionOutputDto } from './presentation/update-action-output.dto';
import { ExceptionManager } from '@core/domain/exception-manager';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class UpdateActionController {
  private readonly logger = new Logger(UpdateActionController.name);

  constructor(private readonly updateActionService: UpdateActionService) {}

  @MessagePattern({ cmd: 'muses.action.update' })
  async update(@Payload() dto: UpdateActionInputDto): Promise<UpdateActionOutputDto> {
    try {
      const command = new UpdateActionCommand(dto);

      const action = await this.updateActionService.process(command);

      const mapper = new UpdateActionOutputDto(action);

      return mapper;
    } catch (error) {
      this.logger.error(error);
      throw ExceptionManager.createSignatureError(error);
    }
  }
}
