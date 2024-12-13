import { Controller, Inject, Logger } from '@nestjs/common';
import { CreateEcosystemService } from '@module-eco/application/use-cases/create-ecosystem/create-ecosystem.service';
import { CreateEcosystemCommand } from '@module-eco/application/use-cases/create-ecosystem/create-ecosystem.command';
import { CreateEcosystemInputDto } from '@module-eco/infrastructure/controllers/create-ecosystem/presentation/create-ecosystem-input.dto';
import {
  CreateEcosystemOutputDto,
  ICreateEcosystemOutputDto,
} from '@module-eco/infrastructure/controllers/create-ecosystem/presentation/create-ecosystem-output.dto';
import { ClientProxy, ClientProxyFactory, MessagePattern, Payload, RpcException, Transport } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller()
export class CreateEcosystemController {
  private readonly logger = new Logger(CreateEcosystemController.name);

  constructor(
    private readonly createEcosystemService: CreateEcosystemService,
    @Inject('MUSES_CONTEXT_NATS_SERVICE')
    private readonly clientProxy: ClientProxy,
  ) {}

  @MessagePattern({ cmd: 'muses.ecosystem.create' })
  async create(@Payload() dto: CreateEcosystemInputDto): Promise<ICreateEcosystemOutputDto> {
    try {
      const command = new CreateEcosystemCommand({
        name: dto.name,
        description: dto.description,
        isEnabled: dto.isEnabled,
      });

      const domain = await this.createEcosystemService.process(command);

      const mapper = new CreateEcosystemOutputDto(domain);

      const output = await lastValueFrom(
        this.clientProxy.send({ cmd: 'muses.ecosystem.create.confirmed' }, mapper),
      );

      return mapper;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }
}
