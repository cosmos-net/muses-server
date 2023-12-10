import { Module } from '@nestjs/common';
import { AuthController } from '@management-auth/auth.controller';
import { AuthService } from '@management-auth/auth.service';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
