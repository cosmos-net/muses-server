import { DisableEcosystemCommand } from '@context-ecosystem/application/use-cases/disable-ecosystem/disable-ecosystem.command';
import { DisableEcosystemService } from '@context-ecosystem/application/use-cases/disable-ecosystem/disable-ecosystem.service';
import { Controller, Logger } from '@nestjs/common';
import {
  DisableEcosystemOutputDto,
  IDisableEcosystemOutputDto,
} from '@context-ecosystem/infrastructure/controllers/disable-ecosystem/presentation/disable-ecosystem-output.dto';
import { DisableEcosystemInputDto } from '@context-ecosystem/infrastructure/controllers/disable-ecosystem/presentation/disable-ecosystem-input.dto';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { ECOSYSTEM } from '@module-common/infrastructure/constants/message-patterns';

@Controller()
export class DisableEcosystemController {
  private readonly logger = new Logger(DisableEcosystemController.name);
  constructor(private readonly disableEcosystemService: DisableEcosystemService) {}

  @MessagePattern({ cmd: ECOSYSTEM.DISABLE })
  async disable(@Payload() dto: DisableEcosystemInputDto): Promise<IDisableEcosystemOutputDto> {
      const { id } = dto;

      const command = new DisableEcosystemCommand({ id });

      const result = await this.disableEcosystemService.process(command);

      const mapper = new DisableEcosystemOutputDto({
        success: result > 0,
        id,
      });

      return mapper;
    
  }
}
