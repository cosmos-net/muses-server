import { Controller, Logger } from '@nestjs/common';
import { RetrieveEcosystemOutputDto } from '@context-ecosystem/infrastructure/controllers/retrieve-ecosystem/presentation/retrieve-ecosystem-output.dto';
import { RetrieveEcosystemService } from '@context-ecosystem/application/use-cases/retrieve-ecosystem/retrieve-ecosystem.service';
import { RetrieveEcosystemQuery } from '@context-ecosystem/application/use-cases/retrieve-ecosystem/retrieve-ecosystem.query';
import { RetrieveEcosystemInputDto } from '@context-ecosystem/infrastructure/controllers/retrieve-ecosystem/presentation/retrieve-ecosystem-input.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ECOSYSTEM } from '@module-common/infrastructure/constants/message-patterns';

@Controller()
export class RetrieveEcosystemController {
  private readonly logger = new Logger(RetrieveEcosystemController.name);
  constructor(private readonly retrieveEcosystemService: RetrieveEcosystemService) {}

  @MessagePattern({ cmd: ECOSYSTEM.GET })
    async retrieve(@Payload() retrieveEcosystemInputDto: RetrieveEcosystemInputDto): Promise<RetrieveEcosystemOutputDto> {
      const { id, withDisabled } = retrieveEcosystemInputDto;

      const query = new RetrieveEcosystemQuery({ id, withDisabled });

      const ecosystem = await this.retrieveEcosystemService.process(query);

      const mapper = new RetrieveEcosystemOutputDto(ecosystem);

      return mapper;
    
  }
}
