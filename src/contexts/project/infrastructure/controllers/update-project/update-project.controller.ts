import { Controller, Logger } from '@nestjs/common';
import { UpdateProjectInputDto } from '@module-project/infrastructure/controllers/update-project/presentation/update-project-input.dto';
import {
  UpdateProjectOutputDto,
  IUpdateProjectOutputDto,
} from '@module-project/infrastructure/controllers/update-project/presentation/update-project-output.dto';
import { UpdateProjectService } from '@module-project/application/use-cases/update-project/update-project.service';
import { UpdateProjectCommand } from '@module-project/application/use-cases/update-project/update-project.command';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class UpdateProjectController {
  private readonly logger = new Logger(UpdateProjectController.name);
  constructor(private readonly updateProjectService: UpdateProjectService) {}

  @MessagePattern({ cmd: 'muses.project.update' })
  async update(@Payload() dto: UpdateProjectInputDto): Promise<IUpdateProjectOutputDto> {
      const command = new UpdateProjectCommand(dto);

      const project = await this.updateProjectService.process(command);

      const mapper = new UpdateProjectOutputDto(project);

      return mapper;
    
  }
}
