import { Controller, Logger } from '@nestjs/common';
import {
  IUpdateSubModuleOutputDto,
  UpdateSubModuleOutputDto,
} from '@module-sub-module/infrastructure/controllers/update-sub-module/presentation/update-sub-module-output.dto';
import { UpdateSubModuleService } from '@module-sub-module/application/use-cases/update-sub-module/update-sub-module.service';
import { UpdateSubModuleInputDto } from '@module-sub-module/infrastructure/controllers/update-sub-module/presentation/update-sub-module-input.dto';
import { UpdateSubModuleCommand } from '@module-sub-module/application/use-cases/update-sub-module/update-sub-module.command';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class UpdateSubModuleController {
  private readonly logger = new Logger(UpdateSubModuleController.name);
  constructor(private readonly updateSubModuleService: UpdateSubModuleService) {}

  @MessagePattern({ cmd: 'muses.sub-module.update' })
  async update(@Payload() dto: UpdateSubModuleInputDto): Promise<IUpdateSubModuleOutputDto> {
      const command = new UpdateSubModuleCommand({
        id: dto.id,
        name: dto.name,
        description: dto.description,
        isEnabled: dto.isEnabled,
        module: dto.module,
      });

      const submodule = await this.updateSubModuleService.process(command);

      const mapper = new UpdateSubModuleOutputDto(submodule);

      return mapper;
    
  }
}
