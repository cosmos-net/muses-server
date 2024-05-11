import { Body, Controller, Logger, Patch } from '@nestjs/common';
import { UpdateResourceInputDto } from '@module-resource/infrastructure/controllers/update-resource/presentation/update-resource-input.dto';
import {
  IUpdateResourceOutputDto,
  UpdateResourceOutputDto,
} from '@module-resource/infrastructure/controllers/update-resource/presentation/update-resource-output.dto';
import { UpdateResourceService } from '@module-resource/application/use-cases/update-resource/update-resource.service';
import { UpdateResourceCommand } from '@module-resource/application/use-cases/update-resource/update-resource.command';
import { ExceptionManager } from '@lib-commons/domain/exception-manager';

@Controller('resource')
export class UpdateResourceController {
  private readonly logger = new Logger(UpdateResourceController.name);

  constructor(private readonly updateResourceService: UpdateResourceService) {}

  @Patch()
  async update(@Body() dto: UpdateResourceInputDto): Promise<IUpdateResourceOutputDto> {
    try {
      const command = new UpdateResourceCommand(dto);

      const action = await this.updateResourceService.process(command);

      const mapper = new UpdateResourceOutputDto(action);

      return mapper;
    } catch (error) {
      this.logger.error(error);
      throw ExceptionManager.createSignatureError(error);
    }
  }
}
