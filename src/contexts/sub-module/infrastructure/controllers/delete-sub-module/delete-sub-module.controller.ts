import { DeleteSubModuleCommand } from '@module-sub-module/application/use-cases/delete-sub-module/delete-sub-module.command';
import { DeleteSubModuleService } from '@module-sub-module/application/use-cases/delete-sub-module/delete-sub-module.service';
import { Controller, Logger } from '@nestjs/common';
import { DeleteSubModuleInputDto } from '@module-sub-module/infrastructure/controllers/delete-sub-module/presentation/get-sub-module-input.dto';
import {
  DeleteSubModuleOutputDto,
  IDeleteSubModuleOutputDto,
} from '@module-sub-module/infrastructure/controllers/delete-sub-module/presentation/get-sub-module-output.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class DeleteSubModuleController {
  private readonly logger = new Logger(DeleteSubModuleController.name);
  constructor(private readonly deleteSubModuleService: DeleteSubModuleService) {}

  @MessagePattern({ cmd: 'muses.action.disable' })
  async delete(@Payload() dto: DeleteSubModuleInputDto): Promise<IDeleteSubModuleOutputDto> {
      const command = new DeleteSubModuleCommand(dto);

      const result = await this.deleteSubModuleService.process(command);

      const success = result ? (result ? true : false) : false;

      const mapper = new DeleteSubModuleOutputDto({
        success,
        id: dto.id,
      });

      return mapper;
    
  }
}
