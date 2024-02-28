import { CreateSubModuleService } from '@app-main/modules/sub-module/application/use-cases/create-sub-module/create-sub-module.service';
import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CreateSubModuleInputDto } from './presentation/create-sub-module-input.dto';
import { CreateSubModuleOutputDto } from './presentation/create-sub-module-output.dto';
import { CreateSubModuleCommand } from '@app-main/modules/sub-module/application/use-cases/create-sub-module/create-sub-module.command';
import { ExceptionManager } from '@lib-commons/domain/exception-manager';

@Controller('/sub-module')
export class CreateSubModuleController {
  private readonly logger = new Logger(CreateSubModuleController.name);
  constructor(private readonly createSubModuleService: CreateSubModuleService) {}

  @Post()
  async create(@Body() dto: CreateSubModuleInputDto): Promise<CreateSubModuleOutputDto> {
    try {
      const command = new CreateSubModuleCommand({
        name: dto.name,
        description: dto.description,
        module: dto.module,
        enabled: dto.enabled,
      });

      const subModule = await this.createSubModuleService.process(command);

      const mapper = new CreateSubModuleOutputDto(subModule);

      return mapper;
    } catch (error) {
      this.logger.error(error);
      throw ExceptionManager.createSignatureError(error);
    }
  }
}
