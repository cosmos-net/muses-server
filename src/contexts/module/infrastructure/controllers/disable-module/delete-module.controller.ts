import { Controller, Logger } from '@nestjs/common';
import { ExceptionManager } from '@core/domain/exception-manager';
import { DeleteModuleService } from '@module-module/application/use-cases/delete-module/delete-module.service';
import { DisableModuleInputDto } from '@module-module/infrastructure/controllers/disable-module/presentation/disable-module-input.dto';
import {
  DisableModuleOutputDto,
  IDisableModuleOutputDto,
} from '@module-module/infrastructure/controllers/disable-module/presentation/disable-module-output.dto';
import { DeleteModuleCommand } from '@module-module/application/use-cases/delete-module/delete-module.command';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class DeleteModuleController {
  private readonly logger = new Logger(DeleteModuleController.name);
  constructor(private readonly deleteModuleService: DeleteModuleService) {}

  @MessagePattern({ cmd: 'muses.module.disable' })
  async delete(@Payload() dto: DisableModuleInputDto): Promise<IDisableModuleOutputDto> {
    try {
      const command = new DeleteModuleCommand(dto);

      const result = await this.deleteModuleService.process(command);

      const success = result ? (result ? true : false) : false;

      const mapper = new DisableModuleOutputDto({
        success,
        id: dto.id,
      });

      return mapper;
    } catch (error) {
      this.logger.error(error);
      throw ExceptionManager.createSignatureError(error);
    }
  }
}
