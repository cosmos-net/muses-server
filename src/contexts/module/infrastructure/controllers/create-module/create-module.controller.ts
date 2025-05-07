import { CreateModuleService } from '@module-module/application/use-cases/create-module/create-module.service';
import { Controller, Logger } from '@nestjs/common';
import { CreateModuleInputDto } from '@module-module/infrastructure/controllers/create-module/presentation/create-module-input.dto';
import { CreateModuleOutputDto } from '@module-module/infrastructure/controllers/create-module/presentation/create-module-output.dto';
import { CreateModuleCommand } from '@module-module/application/use-cases/create-module/create-module.command';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';


@Controller()
export class CreateModuleController {
  private readonly logger = new Logger(CreateModuleController.name);
  constructor(private readonly createModuleService: CreateModuleService) {}

  @MessagePattern({ cmd: 'MUSES.MODULE.CREATE' })
  async create(@Payload() dto: CreateModuleInputDto): Promise<CreateModuleOutputDto> {
      const command = new CreateModuleCommand(dto);

      const module = await this.createModuleService.process(command);

      const mapper = new CreateModuleOutputDto(module);

      return mapper;
    
  }
}
