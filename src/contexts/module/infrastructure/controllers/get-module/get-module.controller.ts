import { GetModuleService } from '@module-module/application/use-cases/get-module/get-module.service';
import { Controller, Logger } from '@nestjs/common';
import {
  GetModuleOutputDto,
  IGetModuleOutputDto,
} from '@module-module/infrastructure/controllers/get-module/presentation/get-module-output.dto';
import { ExceptionManager } from '@core/domain/exception-manager';
import { GetModuleQuery } from '@module-module/application/use-cases/get-module/get-module.query';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetModuleInputDto } from '@module-module/infrastructure/controllers/get-module/presentation/get-module-input.dto';

@Controller()
export class GetModuleController {
  private readonly logger = new Logger(GetModuleController.name);
  constructor(private readonly getModuleService: GetModuleService) {}

  @MessagePattern({ cmd: 'muses.module.get' })
  async Get(@Payload() dto: GetModuleInputDto): Promise<IGetModuleOutputDto> {
    try {
      const query = new GetModuleQuery({
        id: dto.id,
        withDisabled: dto.withDisabled,
        withProject: true,
      });

      const module = await this.getModuleService.process(query);

      const mapper = new GetModuleOutputDto(module);

      return mapper;
    } catch (error) {
      this.logger.error(error);
      throw ExceptionManager.createSignatureError(error);
    }
  }
}
