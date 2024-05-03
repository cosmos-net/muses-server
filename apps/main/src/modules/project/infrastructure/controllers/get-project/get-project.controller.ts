import { GetProjectService } from '@module-project/application/use-cases/get-project/get-project.service';
import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { ExceptionManager } from '@lib-commons/domain/exception-manager';
import { GetProjectInputDto } from './presentation/get-project-input.dto';
import { GetProjectQuery } from '@module-project/application/use-cases/get-project/get-project.query';
import {
  GetProjectOutputDto,
  IGetProjectOutputDto,
} from '@module-project/infrastructure/controllers/get-project/presentation/get-project-output.dto';

@Controller('project/')
export class GetProjectController {
  private readonly logger = new Logger(GetProjectController.name);
  constructor(private readonly getProjectService: GetProjectService) {}

  @Get('/:id')
  async Get(@Param('id') idProject: string, @Query() dto: GetProjectInputDto): Promise<IGetProjectOutputDto> {
    try {
      dto.setId = idProject;
      const { id, withDisabled } = dto;

      const query = new GetProjectQuery({
        id,
        withDisabled,
      });

      const project = await this.getProjectService.process(query);

      const mapper = new GetProjectOutputDto(project);

      return mapper;
    } catch (error) {
      this.logger.error(error);
      throw ExceptionManager.createSignatureError(error);
    }
  }
}
