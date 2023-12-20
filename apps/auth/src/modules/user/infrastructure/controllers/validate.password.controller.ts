import {
    BadRequestException,
    Controller,
    Get,
    Headers,
    HttpException,
    Logger,
    Param,
  } from '@nestjs/common';
import { ValidatePasswordInputDto, ValidatePasswordOutputDto } from '@module-user/infrastructure';
// import { ValidatePasswordService, PasswordValidationQuery } from '@module-user/application';
import { ValidatePasswordService } from '@module-user/application';
  
  @Controller('user/')
  export class PasswordValidationController {
    private readonly logger = new Logger(PasswordValidationController.name);
    constructor(private readonly validatePasswordService: ValidatePasswordService) {}
  
    @Get('validate-password/:password')
    async UpdateEcosystem(
      @Headers() headers,
      @Param('password') password: ValidatePasswordInputDto,
    ): Promise<ValidatePasswordOutputDto> {
      try {
        console.log(headers);
        console.log(password);

        // const query = new PasswordValidationQuery(password, "sadsadassad");
  
        // const command = new UpdateEcosystemCommand({ id, name, description, isEnabled });
  
        // const domain = await this.updateEcosystemService.process(command);
  
        return new ValidatePasswordOutputDto({
          validated: true,
        });
  
      } catch (error) {
        if (error instanceof HttpException) throw error;
        const err = error as Error;
        this.logger.error(err.message, err.stack);
        throw new BadRequestException(err.message, err.name);
      }
    }
  }
  