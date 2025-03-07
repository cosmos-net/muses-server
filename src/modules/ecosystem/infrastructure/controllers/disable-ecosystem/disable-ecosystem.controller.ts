import { DisableEcosystemCommand } from '@module-eco/application/use-cases/disable-ecosystem/disable-ecosystem.command';
import { DisableEcosystemService } from '@module-eco/application/use-cases/disable-ecosystem/disable-ecosystem.service';
import { Controller, Logger } from '@nestjs/common';
import {
  DisableEcosystemOutputDto,
  IDisableEcosystemOutputDto,
} from '@module-eco/infrastructure/controllers/disable-ecosystem/presentation/disable-ecosystem-output.dto';
import { DisableEcosystemInputDto } from '@module-eco/infrastructure/controllers/disable-ecosystem/presentation/disable-ecosystem-input.dto';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

@Controller()
export class DisableEcosystemController {
  private readonly logger = new Logger(DisableEcosystemController.name);
  constructor(private readonly disableEcosystemService: DisableEcosystemService) {}

  @MessagePattern({ cmd: 'muses.ecosystem.disable' })
  async disable(@Payload() dto: DisableEcosystemInputDto): Promise<IDisableEcosystemOutputDto> {
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
      throw new RpcException(error);
    }
  }
}
