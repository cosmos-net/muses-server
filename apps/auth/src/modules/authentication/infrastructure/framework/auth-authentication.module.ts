import { Module, forwardRef } from '@nestjs/common';
import { AuthModuleFacadeService } from '@module-auth/infrastructure/domain/auth-module-facade.service';
import { JsonWebTokenService } from '@app-auth/modules/common/infrastructure/domain/json-web-token.service';

import { ConfigModule } from '@nestjs/config';
import { MainConfigOptions } from '@app-auth/modules/main/infrastructure/config/options/config.options';
import { AuthMainModule } from '@app-auth/modules/main/infrastructure/framework/auth-main.module';
import {
  AUTH_MODULE_FACADE_SERVICE,
  JSON_WEB_TOKEN_SERVICE,
} from '@module-auth/application/use-cases/constants/injection-tokens';
import { LogInService } from '@module-auth/application/use-cases/login/login.service';
import { LogInController } from '@module-auth/infrastructure/controllers/login/login.controller';

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
