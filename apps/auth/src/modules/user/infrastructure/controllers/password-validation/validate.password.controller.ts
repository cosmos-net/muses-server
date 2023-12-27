import { BadRequestException, Controller, Get, Headers, HttpException, Logger, Param } from '@nestjs/common';
import { ValidatePasswordOutputDto } from '@module-user/infrastructure/controllers/password-validation/presentation/validate-password-output.dto';
// import { ValidatePasswordOutputDto } from '@module-user/infrastructure';
import { ValidatePasswordService } from '@module-user/application/use-cases/validate-password/validate-password.service';
import { ValidatePasswordQuery } from '@module-user/application/use-cases/validate-password/validate-password.query';
// import { ValidatePasswordService, ValidatePasswordQuery } from '@module-user/application';

@Controller('user/')
export class PasswordValidationController {
  private readonly logger = new Logger(PasswordValidationController.name);
  constructor(private readonly validatePasswordService: ValidatePasswordService) {}

  @Get('validate-password/:password')
  async PasswordValidation(
    @Headers() headers,
    @Param('password') password: string,
  ): Promise<ValidatePasswordOutputDto> {
    try {
      const query = new ValidatePasswordQuery({ token: headers.authorization, password });

      const isValidated = await this.validatePasswordService.process(query);

      return new ValidatePasswordOutputDto({
        validated: isValidated,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      const err = error as Error;
      this.logger.error(err.message, err.stack);
      throw new BadRequestException(err.message, err.name);
    }
  }
}
