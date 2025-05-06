import { DisableActionService } from '@module-action/application/use-cases/action/disable-action/disable-action.service';
import { Controller, Logger } from '@nestjs/common';
import {
  DisableActionOutputDto,
  IDisableActionOutputDto,
} from '@module-action/infrastructure/controllers/action/disable-action/presentation/disable-action-output.dto';
import { DisableActionCommand } from '@module-action/application/use-cases/action/disable-action/disable-action.command';
import { DisableActionInputDto } from '@module-action/infrastructure/controllers/action/disable-action/presentation/disable-action-input.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class DisableActionController {
  private readonly logger = new Logger(DisableActionController.name);
  constructor(private readonly disableActionService: DisableActionService) {}

  @MessagePattern({ cmd: 'muses.action.disable' })
  async Get(@Payload() dto: DisableActionInputDto): Promise<IDisableActionOutputDto> {
    try {
      const command = new DisableActionCommand({
        id: dto.id,
      });

      const result = await this.disableActionService.process(command);

      const success = result ? (result ? true : false) : false;

      const mapper = new DisableActionOutputDto({
        success,
        id: dto.id,
      });

      return mapper;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
