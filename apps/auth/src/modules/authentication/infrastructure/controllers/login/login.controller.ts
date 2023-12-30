import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginInputDto, LoginOutputDto } from '@app-auth/modules/authentication/infrastructure';
import { LogInService, LoginCommand } from '@app-auth/modules/authentication/application';
import { JwtType } from '@lib-commons/domain';
import { ExceptionManager } from '@lib-commons/domain/exception-manager';

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
      throw ExceptionManager.createSignatureError(error);
    }
  }
}
