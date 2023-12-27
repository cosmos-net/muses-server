import { Module, forwardRef } from '@nestjs/common';
import { LogInController } from '@app-auth/modules/authentication/infrastructure';
import { AuthModuleFacadeService } from '@app-auth/modules/authentication/infrastructure/domain/auth-module-facade.service';
import { JsonWebTokenService } from '@app-auth/modules/commons/infrastructure/domain/json-web-token.service';
import {
  LogInService,
  AUTH_MODULE_FACADE_SERVICE,
  JSON_WEB_TOKEN_SERVICE,
} from '@app-auth/modules/authentication/application';
import { AuthMainModule, MainConfigOptions } from '@app-auth/modules/main/infrastructure';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(MainConfigOptions), forwardRef(() => AuthMainModule)],
  controllers: [LogInController],
  providers: [
    LogInService,
    {
      provide: AUTH_MODULE_FACADE_SERVICE,
      useClass: AuthModuleFacadeService,
    },
    {
      provide: JSON_WEB_TOKEN_SERVICE,
      useClass: JsonWebTokenService,
    },
  ],
})
export class AuthAuthenticationModule {}
