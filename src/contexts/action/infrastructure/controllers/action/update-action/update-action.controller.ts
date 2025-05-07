import { UpdateActionService } from '@module-action/application/use-cases/action/update-action/update-action.service';
import { Controller, Logger } from '@nestjs/common';
import { UpdateActionInputDto } from '@module-action/infrastructure/controllers/action/update-action/presentation/update-action-input.dto';
import { UpdateActionCommand } from '@module-action/application/use-cases/action/update-action/update-action.command';
import { UpdateActionOutputDto } from './presentation/update-action-output.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class UpdateActionController {
  private readonly logger = new Logger(UpdateActionController.name);

  constructor(private readonly updateActionService: UpdateActionService) {}

  @MessagePattern({ cmd: 'MUSES.ACTION.UPDATE' })
  async update(@Payload() dto: UpdateActionInputDto): Promise<UpdateActionOutputDto> {
      const command = new UpdateActionCommand(dto);

      const action = await this.updateActionService.process(command);

      const mapper = new UpdateActionOutputDto(action);

      return mapper;
    
  }
}
