import { UpdateActionService } from '@module-action/application/use-cases/update-action/update-action.service';
import { Body, Controller, Logger, Patch } from '@nestjs/common';
import { UpdateActionInputDto } from '@module-action/infrastructure/controllers/update-action/presentation/update-action-input.dto';
import { UpdateActionCommand } from '@module-action/application/use-cases/update-action/update-action.command';
import { UpdateActionOutputDto } from './presentation/update-action-output.dto';
import { ExceptionManager } from '@lib-commons/domain/exception-manager';

@Controller('actions')
export class UpdateActionController {
  private readonly logger = new Logger(UpdateActionController.name);

  constructor(private readonly updateActionService: UpdateActionService) {}

  @Patch()
  async update(@Body() dto: UpdateActionInputDto): Promise<UpdateActionOutputDto> {
    try {
      const command = new UpdateActionCommand({
        id: dto.id,
        name: dto.name,
        description: dto.description,
        enabled: dto.isEnabled,
        modules: dto.modules,
        subModules: dto.subModules,
      });

      const action = await this.updateActionService.process(command);

      const mapper = new UpdateActionOutputDto(action);

      return mapper;
    } catch (error) {
      this.logger.error(error);
      throw ExceptionManager.createSignatureError(error);
    }
  }
}
