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
import { UpdateEcosystemService } from '@management-main/modules/ecosystem/application/use-cases/update-ecosystem.service';
import { UpdateEcosystemInputDto } from '@management-main/modules/ecosystem/infrastructure/controllers/update-ecosystem/presentation/update-ecosystem-input.dto';
import { UpdateEcosystemOutputDto } from '@management-main/modules/ecosystem/infrastructure/controllers/update-ecosystem/presentation/update-ecosystem-output.dto';
import { UpdateEcosystemCommand } from '@management-main/modules/ecosystem/application/use-cases/update-ecosystem.command';

@Controller('management-ecosystem/')
export class EcosystemController {
  private readonly logger = new Logger(EcosystemController.name);
  constructor(private readonly updateEcosystemService: UpdateEcosystemService) {}

  @Patch(':uuid')
  async UpdateEcosystem(
    @Param('uuid', ParseUUIDPipe) uuid: string,
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
