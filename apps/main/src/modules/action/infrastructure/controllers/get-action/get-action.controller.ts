import { GetActionService } from '@module-action/application/use-cases/get-action/ge-action.service';
import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { GetActionOutputDto, IGetActionOutputDto } from './presentation/get-action-output.dto';
import { GetActionQuery } from '@app-main/modules/action/application/use-cases/get-action/get-action.query';
import { ExceptionManager } from '@lib-commons/domain/exception-manager';

@Controller('actions')
export class GetActionController {
  private readonly logger = new Logger(GetActionController.name);
  constructor(private readonly getActionService: GetActionService) {}

  @Get('/:id')
  async Get(@Param('id') id: string, @Query('withDisabled') withDisabled: boolean): Promise<IGetActionOutputDto> {
    try {
      const query = new GetActionQuery({
        id,
        withDisabled,
      });

      const action = await this.getActionService.process(query);

      const mapper = new GetActionOutputDto(action);

      return mapper;
    } catch (error) {
      this.logger.error(error);
      throw ExceptionManager.createSignatureError(error);
    }
  }
}
