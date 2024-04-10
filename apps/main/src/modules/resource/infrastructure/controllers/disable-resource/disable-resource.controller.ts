import { Controller, Delete, Logger, Param } from '@nestjs/common';
import { DisableResourceInputDto } from '@module-resource/infrastructure/controllers/disable-resource/presentation/disable-resource-input.dto';
import {
  DisableResourceOutputDto,
  IDisableResourceOutputDto,
} from '@module-resource/infrastructure/controllers/disable-resource/presentation/disable-resource-output.dto';
import { DisableResourceCommand } from '@module-resource/application/use-cases/disable-resource/disable-resource.command';
import { DisableResourceService } from '@module-resource/application/use-cases/disable-resource/disable-resource.service';

@Controller('resource')
export class DisableResourceController {
  private readonly logger = new Logger(DisableResourceController.name);
  constructor(private readonly disableResourceService: DisableResourceService) {}

  @Delete('/:id')
  async Get(@Param() dto: DisableResourceInputDto): Promise<IDisableResourceOutputDto> {
    try {
      const command = new DisableResourceCommand({
        id: dto.id,
      });

      const result = await this.disableResourceService.process(command);

      const success = result ? (result ? true : false) : false;

      const mapper = new DisableResourceOutputDto({
        success,
        id: dto.id,
      });

      return mapper;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
