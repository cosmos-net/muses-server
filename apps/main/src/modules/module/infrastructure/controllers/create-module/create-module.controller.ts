import { CreateModuleService } from '@module-module/application/use-cases/create-module/create-module.service';
import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CreateModuleInputDto } from '@module-module/infrastructure/controllers/create-module/presentation/create-module-input.dto';
import { CreateModuleOutputDto } from '@module-module/infrastructure/controllers/create-module/presentation/create-module-output.dto';
import { CreateModuleCommand } from '@module-module/application/use-cases/create-module/create-module.command';
import { ExceptionManager } from '@lib-commons/domain/exception-manager';

@Controller('/module')
export class CreateModuleController {
  private readonly logger = new Logger(CreateModuleController.name);
  constructor(private readonly createModuleService: CreateModuleService) {}

  @Post()
  async create(@Body() dto: CreateModuleInputDto): Promise<CreateModuleOutputDto> {
    try {
      const command = new CreateModuleCommand({
        name: dto.name,
        description: dto.description,
        project: dto.project,
        enabled: dto.enabled,
      });

      const module = await this.createModuleService.process(command);

      const mapper = new CreateModuleOutputDto(module);

      return mapper;
    } catch (error) {
      this.logger.error(error);
      throw ExceptionManager.createSignatureError(error);
    }
  }
}
