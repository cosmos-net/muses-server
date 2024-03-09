import { Body, Controller, Logger, Patch } from '@nestjs/common';
import { ExceptionManager } from '@lib-commons/domain/exception-manager';
import {
  IUpdateSubModuleOutputDto,
  UpdateSubModuleOutputDto,
} from '@module-sub-module/infrastructure/controllers/update-sub-module/presentation/update-sub-module-output.dto';
import { UpdateSubModuleService } from '@module-sub-module/application/use-cases/update-sub-module/update-sub-module.service';
import { UpdateSubModuleInputDto } from '@module-sub-module/infrastructure/controllers/update-sub-module/presentation/update-sub-module-input.dto';
import { UpdateSubModuleCommand } from '@module-sub-module/application/use-cases/update-sub-module/update-sub-module.command';

@Controller('sub-module/')
export class UpdateSubModuleController {
  private readonly logger = new Logger(UpdateSubModuleController.name);
  constructor(private readonly updateSubModuleService: UpdateSubModuleService) {}

  @Patch()
  async update(@Body() dto: UpdateSubModuleInputDto): Promise<IUpdateSubModuleOutputDto> {
    try {
      const command = new UpdateSubModuleCommand({
        id: dto.id,
        name: dto.name,
        description: dto.description,
        enabled: dto.enabled,
        module: dto.module,
      });

      const submodule = await this.updateSubModuleService.process(command);

      const mapper = new UpdateSubModuleOutputDto(submodule);

      return mapper;
    } catch (error) {
      this.logger.error(error);
      throw ExceptionManager.createSignatureError(error);
    }
  }
}
