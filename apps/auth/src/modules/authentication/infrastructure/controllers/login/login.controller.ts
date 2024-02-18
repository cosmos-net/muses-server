import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtType } from '@lib-commons/domain/contracts/types/var-environment-map/jwt/jwt.type';
import { ExceptionManager } from '@lib-commons/domain/exception-manager';
import { LoginCommand } from '@module-auth/application/use-cases/login/login.command';
import { LogInService } from '@module-auth/application/use-cases/login/login.service';
import { LoginInputDto } from '@module-auth/infrastructure/controllers/login/presentation/login-input.dto';
import { LoginOutputDto } from '@module-auth/infrastructure/controllers/login/presentation/login-output.dto';

@Controller('authentication/')
export class LogInController {
  private logger = new Logger(LogInController.name);

  constructor(private readonly loginService: LogInService, private readonly config: ConfigService) {}
  @Post('login/')
  async login(@Body() loginInputDto: LoginInputDto): Promise<LoginOutputDto> {
    try {
      const { email, password } = loginInputDto;
      const { secret, expiresIn } = this.config.get<JwtType>('jwt') as JwtType;

      const command = new LoginCommand({
        email,
        password,
        secret,
        expiresIn,
      });

      const token = await this.loginService.process(command);

      const loginOutputDto = new LoginOutputDto({ token });

      return loginOutputDto;
    } catch (error) {
      this.logger.error(error);
      throw ExceptionManager.createSignatureError(error);
    }
  }
}
