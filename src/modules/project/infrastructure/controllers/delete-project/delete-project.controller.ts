import { Controller, Logger } from '@nestjs/common';
import { ExceptionManager } from '@core/domain/exception-manager';
import { DeleteProjectService } from '@module-project/application/use-cases/delete-project/delete-project.service';
import { DeleteProjectInputDto } from './presentation/delete-project-input.dto';
import { DeleteProjectOutputDto, IDeleteProjectOutputDto } from './presentation/delete-project-output.dto';
import { DeleteProjectCommand } from '@module-project/application/use-cases/delete-project/delete-project.command';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class DeleteProjectController {
  private readonly logger = new Logger(DeleteProjectController.name);
  constructor(private readonly deleteProjectService: DeleteProjectService) {}

  @MessagePattern({ cmd: 'muses.project.disable' })
  async Get(@Payload() dto: DeleteProjectInputDto): Promise<IDeleteProjectOutputDto> {
    try {
      const command = new DeleteProjectCommand({
        id: dto.id,
      });

      const result = await this.deleteProjectService.process(command);

      const success = result ? (result > 0 ? true : false) : false;

      const mapper = new DeleteProjectOutputDto({
        success,
        id: dto.id,
      });

      return mapper;
    } catch (error) {
      this.logger.error(error);
      throw ExceptionManager.createSignatureError(error);
    }
  }
}
