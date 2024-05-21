import { DeleteSubModuleCommand } from '@module-sub-module/application/use-cases/delete-sub-module/delete-sub-module.command';
import { DeleteSubModuleService } from '@module-sub-module/application/use-cases/delete-sub-module/delete-sub-module.service';
import { ExceptionManager } from '@core/domain/exception-manager';
import { Controller, Logger, Delete, Param } from '@nestjs/common';
import { DeleteSubModuleInputDto } from '@module-sub-module/infrastructure/controllers/delete-sub-module/presentation/get-sub-module-input.dto';
import {
  DeleteSubModuleOutputDto,
  IDeleteSubModuleOutputDto,
} from '@module-sub-module/infrastructure/controllers/delete-sub-module/presentation/get-sub-module-output.dto';

@Controller('sub-module/')
export class DeleteSubModuleController {
  private readonly logger = new Logger(DeleteSubModuleController.name);
  constructor(private readonly deleteSubModuleService: DeleteSubModuleService) {}

  @Delete('/:id')
  async delete(@Param() dto: DeleteSubModuleInputDto): Promise<IDeleteSubModuleOutputDto> {
    try {
      const command = new DeleteSubModuleCommand(dto);

      const result = await this.deleteSubModuleService.process(command);

      const success = result ? (result ? true : false) : false;

      const mapper = new DeleteSubModuleOutputDto({
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
