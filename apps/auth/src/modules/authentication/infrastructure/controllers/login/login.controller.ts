import {
  BadRequestException,
  Body,
  Controller,
  HttpException,
  Logger,
  Post,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginInputDto } from '@management-auth/modules/authentication/infrastructure/controllers/login/presentation/login-input.dto';
import { LogInService } from '@management-auth/modules/authentication/application/use-cases/login/login.service';
import { JwtType } from '@management-commons/domain/contracts/types/var-environment-map/jwt/jwt.type';
import { LoginCommand } from '@management-auth/modules/authentication/application/use-cases/login/login.command';
import { LoginOutputDto } from '@management-auth/modules/authentication/infrastructure/controllers/login/presentation/login-output.dto';

@Controller('authentication/')
export class LogInController {
  private logger = new Logger(LogInController.name);

  constructor(
    private readonly loginService: LogInService,
    private readonly config: ConfigService,
  ) {}
  @Post('login/')
  async login(@Body() loginInputDto: LoginInputDto): Promise<LoginOutputDto> {
    try {
      const { username, password } = loginInputDto;
      const { secret, expiresIn } = this.config.get<JwtType>('jwt') as JwtType;

      const command = new LoginCommand({
        username,
        password,
        secret,
        expiresIn,
      });

      const token = await this.loginService.process(command);

      const loginOutputDto = new LoginOutputDto(token);

      return loginOutputDto;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      const err = error as Error;
      this.logger.error(err.message, err.stack);
      throw new BadRequestException(err.message, err.name);
    }
  }
}
