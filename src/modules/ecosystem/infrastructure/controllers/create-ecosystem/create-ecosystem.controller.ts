import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CreateEcosystemService } from '@module-eco/application/use-cases/create-ecosystem/create-ecosystem.service';
import { CreateEcosystemCommand } from '@module-eco/application/use-cases/create-ecosystem/create-ecosystem.command';
import { CreateEcosystemInputDto } from '@module-eco/infrastructure/controllers/create-ecosystem/presentation/create-ecosystem-input.dto';
import {
  CreateEcosystemOutputDto,
  ICreateEcosystemOutputDto,
} from '@module-eco/infrastructure/controllers/create-ecosystem/presentation/create-ecosystem-output.dto';
import { ExceptionManager } from '@core/domain/exception-manager';

@Controller('ecosystem/')
export class CreateEcosystemController {
  private readonly logger = new Logger(CreateEcosystemController.name);
  constructor(private readonly createEcosystemService: CreateEcosystemService) {}

  @Post()
  async create(@Body() dto: CreateEcosystemInputDto): Promise<ICreateEcosystemOutputDto> {
    try {
      const command = new CreateEcosystemCommand({
        name: dto.name,
        description: dto.description,
        isEnabled: dto.isEnabled,
      });

      const domain = await this.createEcosystemService.process(command);

      const mapper = new CreateEcosystemOutputDto(domain);
      return mapper;
    } catch (error) {
      this.logger.error(error);
      throw ExceptionManager.createSignatureError(error);
    }
  }
}
