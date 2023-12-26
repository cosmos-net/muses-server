import { BadRequestException, Body, Controller, HttpException, Logger, Post } from '@nestjs/common';
import { CreateEcosystemCommand, CreateEcosystemService } from '@module-eco/application';
import { CreateEcosystemInputDto, CreateEcosystemOutputDto } from '@module-eco/infrastructure';

@Controller('management-ecosystem/')
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
      if (error instanceof HttpException) throw error;
      const err = error as Error;
      this.logger.error(err.message, err.stack);
      throw new BadRequestException(err.message, err.name);
    }
  }
}
