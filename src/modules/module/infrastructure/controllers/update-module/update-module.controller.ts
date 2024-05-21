import { Body, Controller, Logger, Patch } from '@nestjs/common';
import { ExceptionManager } from '@core/domain/exception-manager';
import { UpdateModuleInputDto } from '@module-module/infrastructure/controllers/update-module/presentation/update-module-input.dto';
import {
  IUpdateModuleOutputDto,
  UpdateModuleOutputDto,
} from '@module-module/infrastructure/controllers/update-module/presentation/update-module-output.dto';
import { UpdateModuleService } from '@module-module/application/use-cases/update-module/update-module.service';
import { UpdateModuleCommand } from '@module-module/application/use-cases/update-module/update-module.command';

@Controller('module/')
export class UpdateModuleController {
  private readonly logger = new Logger(UpdateModuleController.name);
  constructor(private readonly updateModuleService: UpdateModuleService) {}

  @Patch()
  async update(@Body() dto: UpdateModuleInputDto): Promise<IUpdateModuleOutputDto> {
    try {
      const command = new UpdateModuleCommand(dto);

      const module = await this.updateModuleService.process(command);

      const mapper = new UpdateModuleOutputDto(module);

      return mapper;
    } catch (error) {
      this.logger.error(error);
      throw ExceptionManager.createSignatureError(error);
    }
  }
}
