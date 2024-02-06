import { DeleteEcosystemCommand } from '@module-eco/application/use-cases/delete-ecosystem/delete-ecosystem.command';
import { DeleteEcosystemService } from '@module-eco/application/use-cases/delete-ecosystem/delete-ecosystem.service';
import { ExceptionManager } from '@lib-commons/domain/exception-manager';
import { Controller, Delete, Logger, Param } from '@nestjs/common';
import { DeleteEcosystemOutputDto, IDeleteEcosystemOutputDto } from './presentation/delete-ecosystem-output.dto';

@Controller('management-ecosystem/')
export class DeleteEcosystemController {
  private readonly logger = new Logger(DeleteEcosystemController.name);
  constructor(private readonly deleteEcosystemService: DeleteEcosystemService) {}

  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<IDeleteEcosystemOutputDto> {
    try {
      const command = new DeleteEcosystemCommand({ id });

      const result = await this.deleteEcosystemService.process(command);

      const success = result ? (result > 0 ? true : false) : false;

      const mapper = new DeleteEcosystemOutputDto({
        success,
        id,
      });

      return mapper;
    } catch (error) {
      this.logger.error(error);
      throw ExceptionManager.createSignatureError(error);
    }
  }
}
