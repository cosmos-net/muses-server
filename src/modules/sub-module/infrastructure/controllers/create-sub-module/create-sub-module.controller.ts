import { CreateSubModuleService } from '@module-sub-module/application/use-cases/create-sub-module/create-sub-module.service';
import { Controller, Logger } from '@nestjs/common';
import { CreateSubModuleInputDto } from './presentation/create-sub-module-input.dto';
import { CreateSubModuleOutputDto } from './presentation/create-sub-module-output.dto';
import { CreateSubModuleCommand } from '@module-sub-module/application/use-cases/create-sub-module/create-sub-module.command';
import { ExceptionManager } from '@core/domain/exception-manager';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class CreateSubModuleController {
  private readonly logger = new Logger(CreateSubModuleController.name);
  constructor(private readonly createSubModuleService: CreateSubModuleService) {}

  @MessagePattern({ cmd: 'MUSES.SUB.MODULE.CREATE' })
  async create(@Payload() dto: CreateSubModuleInputDto): Promise<CreateSubModuleOutputDto> {
    try {
      const command = new CreateSubModuleCommand(dto);

      const subModule = await this.createSubModuleService.process(command);

      const mapper = new CreateSubModuleOutputDto(subModule);

      return mapper;
    } catch (error) {
      this.logger.error(error);
      throw ExceptionManager.createSignatureError(error);
    }
  }
}
