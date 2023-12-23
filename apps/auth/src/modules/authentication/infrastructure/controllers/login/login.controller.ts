import {
  BadRequestException,
  Body,
  Controller,
  HttpException,
  Logger,
  Post,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginInputDto, LoginOutputDto } from '@app-auth/modules/authentication/infrastructure';
import { LogInService, LoginCommand } from '@app-auth/modules/authentication/application';
import { JwtType } from '@lib-commons/domain';

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
      if (error instanceof HttpException) throw error;
      const err = error as Error;
      this.logger.error(err.message, err.stack);
      throw new BadRequestException(err.message, err.name);
    }
  }
}
