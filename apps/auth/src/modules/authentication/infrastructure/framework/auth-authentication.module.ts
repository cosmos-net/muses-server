import { Module, forwardRef } from '@nestjs/common';
import { LogInController } from '@management-auth/modules/authentication/infrastructure/controllers/login/login.controller';
import { LogInService } from '@management-auth/modules/authentication/application/use-cases/login/login.service';
import { AuthMainModule } from '@management-auth/modules/main/infrastructure/framework/auth-main.module';
import { ConfigModule } from '@nestjs/config';
import { MainConfigOptions } from '@management-auth/modules/main/infrastructure/config/options/config.options';

@Module({
  imports: [
    ConfigModule.forRoot(MainConfigOptions),
    forwardRef(() => AuthMainModule),
  ],
  controllers: [LogInController],
  providers: [LogInService],
})
export class AuthAuthenticationModule {}
