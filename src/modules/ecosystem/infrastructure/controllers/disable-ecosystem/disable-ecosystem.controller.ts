import { DisableEcosystemCommand } from '@module-eco/application/use-cases/disable-ecosystem/disable-ecosystem.command';
import { DisableEcosystemService } from '@module-eco/application/use-cases/disable-ecosystem/disable-ecosystem.service';
import { ExceptionManager } from '@core/domain/exception-manager';
import { Controller, Delete, Logger, Param } from '@nestjs/common';
import {
  DisableEcosystemOutputDto,
  IDisableEcosystemOutputDto,
} from '@module-eco/infrastructure/controllers/disable-ecosystem/presentation/disable-ecosystem-output.dto';
import { DisableEcosystemInputDto } from '@module-eco/infrastructure/controllers/disable-ecosystem/presentation/disable-ecosystem-input.dto';

@Controller('ecosystem/')
export class DisableEcosystemController {
  private readonly logger = new Logger(DisableEcosystemController.name);
  constructor(private readonly disableEcosystemService: DisableEcosystemService) {}

  @Delete('/:id')
  async delete(@Param() dto: DisableEcosystemInputDto): Promise<IDisableEcosystemOutputDto> {
    try {
      const { id } = dto;

      const command = new DisableEcosystemCommand({ id });

      const result = await this.disableEcosystemService.process(command);

      const mapper = new DisableEcosystemOutputDto({
        success: result > 0,
        id,
      });

      return mapper;
    } catch (error) {
      this.logger.error(error);
      throw ExceptionManager.createSignatureError(error);
    }
  }
}
