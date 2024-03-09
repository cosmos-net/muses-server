import { Controller, Delete, Logger, Param } from '@nestjs/common';
import { ExceptionManager } from '@lib-commons/domain/exception-manager';
import { DeleteModuleService } from '@module-module/application/use-cases/delete-module/delete-module.service';
import { DeleteModuleInputDto } from '@module-module/infrastructure/controllers/delete-module/presentation/delete-module-input.dto';
import {
  DeleteModuleOutputDto,
  IDeleteModuleOutputDto,
} from '@module-module/infrastructure/controllers/delete-module/presentation/delete-module-output.dto';
import { DeleteModuleCommand } from '@module-module/application/use-cases/delete-module/delete-module.command';

@Controller('module/')
export class DeleteModuleController {
  private readonly logger = new Logger(DeleteModuleController.name);
  constructor(private readonly deleteModuleService: DeleteModuleService) {}

  @Delete('/:id')
  async delete(@Param() dto: DeleteModuleInputDto): Promise<IDeleteModuleOutputDto> {
    try {
      const command = new DeleteModuleCommand({
        id: dto.id,
      });

      const result = await this.deleteModuleService.process(command);

      const success = result ? (result ? true : false) : false;

      const mapper = new DeleteModuleOutputDto({
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
