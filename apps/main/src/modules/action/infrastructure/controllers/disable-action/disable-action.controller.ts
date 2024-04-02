import { DisableActionService } from '@module-action/application/use-cases/disable-action/disable-action.service';
import { Controller, Delete, Logger, Param } from '@nestjs/common';
import {
  DisableActionOutputDto,
  IDisableActionOutputDto,
} from '@module-action/infrastructure/controllers/disable-action/presentation/disable-action-output.dto';
import { DisableActionCommand } from '@module-action/application/use-cases/disable-action/disable-action.command';
import { DisableActionInputDto } from '@module-action/infrastructure/controllers/disable-action/presentation/disable-action-input.dto';

@Controller('actions')
export class DisableActionController {
  private readonly logger = new Logger(DisableActionController.name);
  constructor(private readonly disableActionService: DisableActionService) {}

  @Delete('/:id')
  async Get(@Param() dto: DisableActionInputDto): Promise<IDisableActionOutputDto> {
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
