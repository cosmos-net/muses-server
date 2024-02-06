import { Controller, Get, Logger, Param } from '@nestjs/common';
import { RetrieveEcosystemOutputDto } from '@module-eco/infrastructure';
import { ExceptionManager } from '@lib-commons/domain/exception-manager';
import { RetrieveEcosystemService } from '@module-eco/application/use-cases/retrieve-ecosystem/retrieve-ecosystem.service';
import { RetrieveEcosystemQuery } from '@module-eco/application/use-cases/retrieve-ecosystem/retrieve-ecosystem.query';

@Controller('management-ecosystem/')
export class RetrieveEcosystemController {
  private readonly logger = new Logger(RetrieveEcosystemController.name);
  constructor(private readonly retrieveEcosystemService: RetrieveEcosystemService) {}

  @Get('/:id')
  async retrieve(@Param('id') id: string): Promise<RetrieveEcosystemOutputDto> {
    try {
      const query = new RetrieveEcosystemQuery({ id });

      const ecosystem = await this.retrieveEcosystemService.process(query);

      const mapper = new RetrieveEcosystemOutputDto(ecosystem);

      return mapper;
    } catch (error) {
      this.logger.error(error);
      throw ExceptionManager.createSignatureError(error);
    }
  }
}
