import { GetSubModuleService } from '@module-sub-module/application/use-cases/get-sub-module/get-sub-module.service';
import { Controller, Logger } from '@nestjs/common';
import {
  GetSubModuleOutputDto,
  IGetSubModuleOutputDto,
} from '@module-sub-module/infrastructure/controllers/get-sub-module/presentation/get-sub-module-output.dto';
import { GetSubModuleQuery } from '@module-sub-module/application/use-cases/get-sub-module/get-sub-module.query';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class GetSubModuleController {
  private readonly logger = new Logger(GetSubModuleController.name);
  constructor(private readonly getSubModuleService: GetSubModuleService) {}

  @MessagePattern({ cmd: 'muses.sub-module.get' })
  async Get(@Payload() dto: any): Promise<IGetSubModuleOutputDto> {
      const query = new GetSubModuleQuery(dto);

      const module = await this.getSubModuleService.process(query);

      const mapper = new GetSubModuleOutputDto(module);

      return mapper;
    
  }
}
