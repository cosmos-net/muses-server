import { Controller, Logger } from '@nestjs/common';
import { CreateEcosystemService } from '@context-ecosystem/application/use-cases/create-ecosystem/create-ecosystem.service';
import { CreateEcosystemCommand } from '@context-ecosystem/application/use-cases/create-ecosystem/create-ecosystem.command';
import { CreateEcosystemInputDto } from '@context-ecosystem/infrastructure/controllers/create-ecosystem/presentation/create-ecosystem-input.dto';
import {
  CreateEcosystemOutputDto,
  ICreateEcosystemOutputDto,
} from '@context-ecosystem/infrastructure/controllers/create-ecosystem/presentation/create-ecosystem-output.dto';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { ECOSYSTEM } from '@module-common/infrastructure/constants/message-patterns';

@Controller()
export class CreateEcosystemController {
  private readonly logger = new Logger(CreateEcosystemController.name);

  constructor(
    private readonly createEcosystemService: CreateEcosystemService,
  ) {}

  @MessagePattern({ cmd: ECOSYSTEM.CREATE })
  async create(@Payload() dto: CreateEcosystemInputDto): Promise<ICreateEcosystemOutputDto> {
    try {
      const command = new CreateEcosystemCommand({
        name: dto.name,
        description: dto.description,
        isEnabled: dto.isEnabled,
      });

      const domain = await this.createEcosystemService.process(command);

      const mapper = new CreateEcosystemOutputDto(domain);

      return mapper;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }
}
