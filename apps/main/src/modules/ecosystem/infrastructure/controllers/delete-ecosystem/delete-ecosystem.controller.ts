import { DeleteEcosystemCommand } from '@app-main/modules/ecosystem/application/use-cases/delete-ecosystem/delete-ecosystem.command';
import { DeleteEcosystemService } from '@app-main/modules/ecosystem/application/use-cases/delete-ecosystem/delete-ecosystem.service';
import { ExceptionManager } from '@lib-commons/domain/exception-manager';
import { Controller, Delete, Logger, Param, Response } from '@nestjs/common';

@Controller('management-ecosystem/')
export class DeleteEcosystemController {
  private readonly logger = new Logger(DeleteEcosystemController.name);
  constructor(private readonly deleteEcosystemService: DeleteEcosystemService) {}

  @Delete('/delete/:id')
  async delete(@Param('id') id: string, @Response() res) {
    try {
      const command = new DeleteEcosystemCommand({ id });
      await this.deleteEcosystemService.process(command);
      return res.status(200).json({ message: 'Ecosystem deleted successfully' });
    } catch (error) {
      throw ExceptionManager.createSignatureError(error);
    }
  }
}
