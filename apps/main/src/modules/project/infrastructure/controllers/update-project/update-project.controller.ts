import { Body, Controller, Logger, Patch } from '@nestjs/common';
import { ExceptionManager } from '@lib-commons/domain/exception-manager';
import { UpdateProjectInputDto } from '@module-project/infrastructure/controllers/update-project/presentation/update-project-input.dto';
import {
  UpdateProjectOutputDto,
  IUpdateProjectOutputDto,
} from '@module-project/infrastructure/controllers/update-project/presentation/update-project-output.dto';
import { UpdateProjectService } from '@module-project/application/use-cases/update-project/update-project.service';
import { UpdateProjectCommand } from '@module-project/application/use-cases/update-project/update-project.command';

@Controller('project/')
export class UpdateProjectController {
  private readonly logger = new Logger(UpdateProjectController.name);
  constructor(private readonly updateProjectService: UpdateProjectService) {}

  @Patch()
  async update(@Body() dto: UpdateProjectInputDto): Promise<IUpdateProjectOutputDto> {
    try {
      const command = new UpdateProjectCommand({
        id: dto.id,
        name: dto.name,
        description: dto.description,
        isEnabled: dto.isEnabled,
        ecosystem: dto.ecosystem,
      });

      const project = await this.updateProjectService.process(command);

      const mapper = new UpdateProjectOutputDto(project);

      return mapper;
    } catch (error) {
      this.logger.error(error);
      throw ExceptionManager.createSignatureError(error);
    }
  }
}
