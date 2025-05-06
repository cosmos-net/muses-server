import { GetResourceService } from '@module-resource/application/use-cases/get-resource/get-resource.service';
import { GetResourceQuery } from '@module-resource/application/use-cases/get-resource/get-resource.query';
import { Controller, Logger } from '@nestjs/common';
import { ExceptionManager } from '@core/domain/exception-manager';
import {
  GetResourceOutputDto,
  IGetResourceOutputDto,
} from '@module-resource/infrastructure/controllers/get-resource/presentation/get-resource-output.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class GetResourceController {
  private readonly logger = new Logger(GetResourceController.name);

  constructor(private readonly getResourceService: GetResourceService) {}

  @MessagePattern({ cmd: 'muses.resource.get' })
  async Get(@Payload() dto: any): Promise<IGetResourceOutputDto> {
    try {
      const query = new GetResourceQuery(dto);

      const resource = await this.getResourceService.process(query);

      const mapper = new GetResourceOutputDto(resource);

      return mapper;
    } catch (error) {
      this.logger.error(error);
      throw ExceptionManager.createSignatureError(error);
    }
  }
}
