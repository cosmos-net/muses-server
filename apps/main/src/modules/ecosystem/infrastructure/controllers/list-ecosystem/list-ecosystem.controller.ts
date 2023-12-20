import {
  BadRequestException,
  Body,
  Controller,
  HttpException,
  Logger,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { ListEcosystemQuery, ListEcosystemService } from '@module-eco/application';
import { ListEcosystemInputDto, ListEcosystemOutputDto } from '@module-eco/infrastructure';

@Controller('management-ecosystem/')
export class ListEcosystemController {
  private readonly logger = new Logger(ListEcosystemController.name);
  constructor(private readonly listEcosystemService: ListEcosystemService) {}

  @Patch(':uuid')
  async UpdateEcosystem(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: ListEcosystemInputDto,
  ): Promise<ListEcosystemOutputDto> {
    try {
      const { name, description, isEnabled } = dto;

      const command = new ListEcosystemQuery({ name, description, isEnabled });

      const domain = await this.listEcosystemService.process(command);

      return new ListEcosystemOutputDto(domain.entities());

    } catch (error) {
      if (error instanceof HttpException) throw error;
      const err = error as Error;
      this.logger.error(err.message, err.stack);
      throw new BadRequestException(err.message, err.name);
    }
  }
}
