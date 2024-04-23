import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { RetrieveEcosystemOutputDto } from '@module-eco/infrastructure/controllers/retrieve-ecosystem/presentation/retrieve-ecosystem-output.dto';
import { ExceptionManager } from '@lib-commons/domain/exception-manager';
import { RetrieveEcosystemService } from '@module-eco/application/use-cases/retrieve-ecosystem/retrieve-ecosystem.service';
import { RetrieveEcosystemQuery } from '@module-eco/application/use-cases/retrieve-ecosystem/retrieve-ecosystem.query';
import { RetrieveEcosystemInputDto } from '@module-eco/infrastructure/controllers/retrieve-ecosystem/presentation/retrieve-ecosystem-input.dto';

@Controller('ecosystem/')
export class RetrieveEcosystemController {
  private readonly logger = new Logger(RetrieveEcosystemController.name);
  constructor(private readonly retrieveEcosystemService: RetrieveEcosystemService) {}

  @Get('/:id')
  async retrieve(
    @Param('id') idEcosystem: string,
    @Query() dto: RetrieveEcosystemInputDto,
  ): Promise<RetrieveEcosystemOutputDto> {
    try {
      dto.setId = idEcosystem;
      const { id, withDisabled } = dto;

      const query = new RetrieveEcosystemQuery({ id, withDisabled });

      const ecosystem = await this.retrieveEcosystemService.process(query);

      const mapper = new RetrieveEcosystemOutputDto(ecosystem);

      return mapper;
    } catch (error) {
      this.logger.error(error);
      throw ExceptionManager.createSignatureError(error);
    }
  }
}
