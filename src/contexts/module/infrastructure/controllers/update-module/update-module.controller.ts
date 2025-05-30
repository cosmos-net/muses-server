import { Controller, Logger } from '@nestjs/common';
import { UpdateModuleInputDto } from '@module-module/infrastructure/controllers/update-module/presentation/update-module-input.dto';
import {
  IUpdateModuleOutputDto,
  UpdateModuleOutputDto,
} from '@module-module/infrastructure/controllers/update-module/presentation/update-module-output.dto';
import { UpdateModuleService } from '@module-module/application/use-cases/update-module/update-module.service';
import { UpdateModuleCommand } from '@module-module/application/use-cases/update-module/update-module.command';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class UpdateModuleController {
  private readonly logger = new Logger(UpdateModuleController.name);
  constructor(private readonly updateModuleService: UpdateModuleService) {}

  @MessagePattern({ cmd: 'muses.module.update' })
  async update(@Payload() dto: UpdateModuleInputDto): Promise<IUpdateModuleOutputDto> {
      const command = new UpdateModuleCommand(dto);

      const module = await this.updateModuleService.process(command);

      const mapper = new UpdateModuleOutputDto(module);

      return mapper;
    
  }
}
