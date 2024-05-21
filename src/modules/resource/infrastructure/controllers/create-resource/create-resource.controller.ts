import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CreateResourceCommand } from '@module-resource/application/use-cases/create-resource/create-resource.command';
import { CreateResourceService } from '@module-resource/application/use-cases/create-resource/create-resource.service';
import { ExceptionManager } from '@core/domain/exception-manager';
import { CreateResourceInputDto } from '@module-resource/infrastructure/controllers/create-resource/presentation/create-resource-input.dto';
import {
  CreateResourceOutputDto,
  ICreateResourceOutputDto,
} from '@module-resource/infrastructure/controllers/create-resource/presentation/create-resource-output.dto';

@Controller('/resource')
export class CreateResourceController {
  private readonly logger = new Logger(CreateResourceController.name);

  constructor(private readonly createResourceService: CreateResourceService) {}

  @Post()
  async create(@Body() dto: CreateResourceInputDto): Promise<ICreateResourceOutputDto> {
    try {
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
    } catch (error) {
      this.logger.error(error);
      throw ExceptionManager.createSignatureError(error);
    }
  }
}
