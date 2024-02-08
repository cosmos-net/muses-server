import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CreateEcosystemCommand, CreateEcosystemService } from '@module-eco/application';
import { CreateEcosystemInputDto, CreateEcosystemOutputDto } from '@module-eco/infrastructure';
import { ExceptionManager } from '@lib-commons/domain/exception-manager';

@Controller('ecosystem/')
export class CreateEcosystemController {
  private readonly logger = new Logger(CreateEcosystemController.name);
  constructor(private readonly createEcosystemService: CreateEcosystemService) {}

  @Post()
  async create(@Body() dto: CreateEcosystemInputDto): Promise<CreateEcosystemOutputDto> {
    try {
      const command = new CreateEcosystemCommand({
        name: dto.name,
        description: dto.description,
        enabled: dto.enabled,
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
