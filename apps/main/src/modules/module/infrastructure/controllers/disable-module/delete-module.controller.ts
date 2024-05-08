import { Controller, Delete, Logger, Param } from '@nestjs/common';
import { ExceptionManager } from '@lib-commons/domain/exception-manager';
import { DeleteModuleService } from '@module-module/application/use-cases/delete-module/delete-module.service';
import { DisableModuleInputDto } from '@app-main/modules/module/infrastructure/controllers/disable-module/presentation/disable-module-input.dto';
import {
  DisableModuleOutputDto,
  IDisableModuleOutputDto,
} from '@app-main/modules/module/infrastructure/controllers/disable-module/presentation/disable-module-output.dto';
import { DeleteModuleCommand } from '@module-module/application/use-cases/delete-module/delete-module.command';

@Controller('module/')
export class DeleteModuleController {
  private readonly logger = new Logger(DeleteModuleController.name);
  constructor(private readonly deleteModuleService: DeleteModuleService) {}

  @Delete('/:id')
  async delete(@Param() dto: DisableModuleInputDto): Promise<IDisableModuleOutputDto> {
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
