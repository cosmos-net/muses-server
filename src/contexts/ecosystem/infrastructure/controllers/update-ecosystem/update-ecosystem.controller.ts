import { Controller, Logger } from '@nestjs/common';
import { UpdateEcosystemCommand } from '@context-ecosystem/application/use-cases/update-ecosystem/update-ecosystem.command';
import { UpdateEcosystemService } from '@context-ecosystem/application/use-cases/update-ecosystem/update-ecosystem.service';
import { UpdateEcosystemInputDto } from '@context-ecosystem/infrastructure/controllers/update-ecosystem/presentation/update-ecosystem-input.dto';
import { UpdateEcosystemOutputDto } from '@context-ecosystem/infrastructure/controllers/update-ecosystem/presentation/update-ecosystem-output.dto';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { ECOSYSTEM } from '@module-common/infrastructure/constants/message-patterns';

@Controller()
export class UpdateEcosystemController {
  private readonly logger = new Logger(UpdateEcosystemController.name);
  constructor(private readonly updateEcosystemService: UpdateEcosystemService) {}

  @MessagePattern({ cmd: ECOSYSTEM.UPDATE })
  async UpdateEcosystem(@Payload() updateInputDto: UpdateEcosystemInputDto): Promise<UpdateEcosystemOutputDto> {
    try {
      const { id, name, description, isEnabled } = updateInputDto;

      const command = new UpdateEcosystemCommand({ id, name, description, isEnabled });

      const ecosystem = await this.updateEcosystemService.process(command);

      return new UpdateEcosystemOutputDto(ecosystem);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }
}
