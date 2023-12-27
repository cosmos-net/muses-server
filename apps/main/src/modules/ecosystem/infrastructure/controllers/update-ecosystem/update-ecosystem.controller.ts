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
import { UpdateEcosystemService, UpdateEcosystemCommand } from '@app-main/modules/ecosystem/application';
import { UpdateEcosystemInputDto, UpdateEcosystemOutputDto } from '@app-main/modules/ecosystem/infrastructure';

@Controller('management-ecosystem/')
export class UpdateEcosystemController {
  private readonly logger = new Logger(UpdateEcosystemController.name);
  constructor(private readonly updateEcosystemService: UpdateEcosystemService) {}

  @Patch(':uuid')
  async UpdateEcosystem(
    @Param('uuid', ParseUUIDPipe) id: string,
    @Body() updateInputDto: UpdateEcosystemInputDto,
  ): Promise<UpdateEcosystemOutputDto> {
    try {
      const { id, name, description, isEnabled } = updateInputDto;

      const command = new UpdateEcosystemCommand({ id, name, description, isEnabled });

      const domain = await this.updateEcosystemService.process(command);

      return new UpdateEcosystemOutputDto({
        id: domain.id,
        name: domain.name,
        description: domain.description,
        enabled: domain.isEnabled,
        createdAt: domain.createdAt,
        updatedAt: domain.updatedAt,
        deletedAt: domain.deletedAt,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      const err = error as Error;
      this.logger.error(err.message, err.stack);
      throw new BadRequestException(err.message, err.name);
    }
  }
}
