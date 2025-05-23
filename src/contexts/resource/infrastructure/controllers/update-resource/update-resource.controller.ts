import { Controller, Logger } from '@nestjs/common';
import { UpdateResourceInputDto } from '@module-resource/infrastructure/controllers/update-resource/presentation/update-resource-input.dto';
import {
  IUpdateResourceOutputDto,
  UpdateResourceOutputDto,
} from '@module-resource/infrastructure/controllers/update-resource/presentation/update-resource-output.dto';
import { UpdateResourceService } from '@module-resource/application/use-cases/update-resource/update-resource.service';
import { UpdateResourceCommand } from '@module-resource/application/use-cases/update-resource/update-resource.command';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class UpdateResourceController {
  private readonly logger = new Logger(UpdateResourceController.name);

  constructor(private readonly updateResourceService: UpdateResourceService) {}

  @MessagePattern({ cmd: 'muses.resource.update' })
  async update(@Payload() dto: UpdateResourceInputDto): Promise<IUpdateResourceOutputDto> {
      const command = new UpdateResourceCommand(dto);

      const action = await this.updateResourceService.process(command);

      const mapper = new UpdateResourceOutputDto(action);

      return mapper;
    
  }
}
