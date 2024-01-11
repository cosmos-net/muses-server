import { BadRequestException, Controller, Get, HttpException, Logger, Param, ParseIntPipe } from '@nestjs/common';
import { RetrieveEcosystemOutputDto } from '@module-eco/infrastructure';
import { RetrieveEcosystemService } from '@app-main/modules/ecosystem/application/use-cases/retrieve-ecosystem/retrieve-ecosystem.service';
import { RetrieveEcosystemQuery } from '@app-main/modules/ecosystem/application/use-cases/retrieve-ecosystem/retrieve-ecosystem.query';

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
      if (error instanceof HttpException) throw error;
      const err = error as Error;
      this.logger.error(err.message, err.stack);
      throw new BadRequestException(err.message, err.name);
    }
  }
}
