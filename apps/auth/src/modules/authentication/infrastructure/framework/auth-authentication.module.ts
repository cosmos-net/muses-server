import { Module, forwardRef } from '@nestjs/common';
import { LogInController } from '@app-auth/modules/authentication/infrastructure';
import { LogInService } from '@app-auth/modules/authentication/application';
import { AuthMainModule, MainConfigOptions } from '@app-auth/modules/main/infrastructure';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(MainConfigOptions), forwardRef(() => AuthMainModule)],
  controllers: [LogInController],
  providers: [LogInService],
})
export class AuthAuthenticationModule {}
