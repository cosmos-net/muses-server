import { CreateProjectService } from '@module-project/application/use-cases/create-project/create-project.service';
import { Controller, Logger } from '@nestjs/common';
import { CreateProjectInputDto } from '@module-project/infrastructure/controllers/create-project/presentation/create-project-input.dto';
import { CreateProjectCommand } from '@module-project/application/use-cases/create-project/create-project.command';
import { CreateProjectOutputDto } from '@module-project/infrastructure/controllers/create-project/presentation/create-project-output.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class CreateProjectController {
  private readonly logger = new Logger(CreateProjectController.name);
  constructor(private readonly createProjectService: CreateProjectService) {}

  @MessagePattern({ cmd: 'MUSES.PROJECT.CREATE' })
  async create(@Payload() dto: CreateProjectInputDto): Promise<CreateProjectOutputDto> {
    const command = new CreateProjectCommand({
      name: dto.name,
      description: dto.description,
      isEnabled: dto.isEnabled,
      ecosystem: dto.ecosystem,
    });

    const project = await this.createProjectService.process(command);

    const mapper = new CreateProjectOutputDto(project);

    return mapper;
  }
}
