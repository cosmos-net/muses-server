import { Controller, Logger } from '@nestjs/common';

@Controller('management-project/')
export class CreateProjectController {
  private readonly logger = new Logger(CreateProjectController.name);
}
