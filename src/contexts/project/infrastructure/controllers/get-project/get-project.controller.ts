import { GetProjectService } from '@module-project/application/use-cases/get-project/get-project.service';
import { Controller, Logger } from '@nestjs/common';
import { GetProjectInputDto } from './presentation/get-project-input.dto';
import { GetProjectQuery } from '@module-project/application/use-cases/get-project/get-project.query';
import {
  GetProjectOutputDto,
  IGetProjectOutputDto,
} from '@module-project/infrastructure/controllers/get-project/presentation/get-project-output.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class GetProjectController {
  private readonly logger = new Logger(GetProjectController.name);
  constructor(private readonly getProjectService: GetProjectService) {}

  @MessagePattern({ cmd: 'muses.project.get' })
  async Get(@Payload() dto: GetProjectInputDto): Promise<IGetProjectOutputDto> {
      const { id, withDisabled } = dto;

      const query = new GetProjectQuery({
        id,
        withDisabled,
      });

      const project = await this.getProjectService.process(query);

      const mapper = new GetProjectOutputDto(project);

      return mapper;
    
  }
}
