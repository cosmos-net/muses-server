import { Body, Controller, Logger, Patch } from '@nestjs/common';
import { UpdateEcosystemCommand } from '@module-eco/application/use-cases/update-ecosystem/update-ecosystem.command';
import { UpdateEcosystemService } from '@module-eco/application/use-cases/update-ecosystem/update-ecosystem.service';
import { UpdateEcosystemInputDto } from '@module-eco/infrastructure/controllers/update-ecosystem/presentation/update-ecosystem-input.dto';
import { UpdateEcosystemOutputDto } from '@module-eco/infrastructure/controllers/update-ecosystem/presentation/update-ecosystem-output.dto';
import { ExceptionManager } from '@lib-commons/domain/exception-manager';

@Controller('ecosystem/')
export class UpdateEcosystemController {
  private readonly logger = new Logger(UpdateEcosystemController.name);
  constructor(private readonly updateEcosystemService: UpdateEcosystemService) {}

  @Patch()
  async UpdateEcosystem(@Body() updateInputDto: UpdateEcosystemInputDto): Promise<UpdateEcosystemOutputDto> {
    try {
      const { id, name, description, isEnabled } = updateInputDto;

      const command = new UpdateEcosystemCommand({ id, name, description, isEnabled });

      const domain = await this.updateEcosystemService.process(command);

      return new UpdateEcosystemOutputDto({
        id: domain.id,
        name: domain.name,
        description: domain.description,
        isEnabled: domain.isEnabled,
        createdAt: domain.createdAt,
        updatedAt: domain.updatedAt,
        deletedAt: domain.deletedAt,
      });
    } catch (error) {
      this.logger.error(error);
      throw ExceptionManager.createSignatureError(error);
    }
  }
}
