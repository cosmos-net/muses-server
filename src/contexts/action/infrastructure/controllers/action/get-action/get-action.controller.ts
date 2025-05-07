import { GetActionService } from '@module-action/application/use-cases/action/get-action/get-action.service';
import { Controller, Logger } from '@nestjs/common';
import {
  GetActionOutputDto,
  IGetActionOutputDto,
} from '@module-action/infrastructure/controllers/action/get-action/presentation/get-action-output.dto';
import { GetActionQuery } from '@module-action/application/use-cases/action/get-action/get-action.query';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class GetActionController {
  private readonly logger = new Logger(GetActionController.name);
  constructor(private readonly getActionService: GetActionService) {}

  @MessagePattern({ cmd: 'muses.action.get' })
  async Get(@Payload() dto: any): Promise<IGetActionOutputDto> {
    const query = new GetActionQuery(dto);

    const action = await this.getActionService.process(query);

    const mapper = new GetActionOutputDto(action);

    return mapper;
  }
}
