import { Controller, Logger } from '@nestjs/common';
import { CreateResourceCommand } from '@module-resource/application/use-cases/create-resource/create-resource.command';
import { CreateResourceService } from '@module-resource/application/use-cases/create-resource/create-resource.service';
import { CreateResourceInputDto } from '@module-resource/infrastructure/controllers/create-resource/presentation/create-resource-input.dto';
import {
  CreateResourceOutputDto,
  ICreateResourceOutputDto,
} from '@module-resource/infrastructure/controllers/create-resource/presentation/create-resource-output.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class CreateResourceController {
  private readonly logger = new Logger(CreateResourceController.name);

  constructor(private readonly createResourceService: CreateResourceService) {}

  @MessagePattern({ cmd: 'muses.resource.create' })
  async create(@Payload() dto: CreateResourceInputDto): Promise<ICreateResourceOutputDto> {
    const command = new CreateResourceCommand({
      name: dto.name,
      description: dto.description,
      isEnabled: dto.isEnabled,
      endpoint: dto.endpoint,
      method: dto.method,
      triggers: dto.triggers,
      actions: dto.actions,
    });

    const resource = await this.createResourceService.process(command);

    const mapper = new CreateResourceOutputDto(resource);

    return mapper;
  }
}
