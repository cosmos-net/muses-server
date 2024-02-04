import { CreateProjectService } from '@app-main/modules/project/application/use-cases/create-project/create-project.service';
import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CreateProjectInputDto } from '@module-project/infrastructure/controllers/create-project/presentation/create-project-input.dto';
import { CreateEcosystemOutputDto } from '@app-main/modules/ecosystem/infrastructure';
import { CreateProjectCommand } from '@app-main/modules/project/application/use-cases/create-project/create-project.command';
import { ExceptionManager } from '@lib-commons/domain/exception-manager';
import { CreateProjectOutputDto } from '@module-project/infrastructure/controllers/create-project/presentation/create-project-output.dto';

@Controller('management-project/')
export class CreateProjectController {
  private readonly logger = new Logger(CreateProjectController.name);
  constructor(private readonly createProjectService: CreateProjectService) {}

  @Post()
  async create(@Body() dto: CreateProjectInputDto): Promise<CreateEcosystemOutputDto> {
    try {
      const command = new CreateProjectCommand({
        name: dto.name,
        description: dto.description,
        enabled: dto.enabled,
      });
      const domain = await this.createProjectService.process(command);
      const mapper = new CreateProjectOutputDto(domain);
      return mapper;
    } catch (error) {
      this.logger.error(error);
      throw ExceptionManager.createSignatureError(error);
    }
  }
}
