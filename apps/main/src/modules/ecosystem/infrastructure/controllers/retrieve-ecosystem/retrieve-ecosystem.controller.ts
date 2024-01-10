import { BadRequestException, Controller, Get, HttpException, Logger, Param, Query, ValidationPipe } from '@nestjs/common';
import { RetrieveEcosystemInputDto, RetrieveEcosystemOutputDto } from '@module-eco/infrastructure';

@Controller('management-ecosystem/')
export class RetrieveEcosystemController {
  private readonly logger = new Logger(RetrieveEcosystemController.name);
  constructor(private readonly listEcosystemService: ListEcosystemService) {}

  @Get()
  async retrieve(@Param('id') id: string): Promise<RetrieveEcosystemOutputDto> {
    try {
    } catch (error) {
      if (error instanceof HttpException) throw error;
      const err = error as Error;
      this.logger.error(err.message, err.stack);
      throw new BadRequestException(err.message, err.name);
    }
  }
}
