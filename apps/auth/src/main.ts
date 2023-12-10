import { NestFactory } from '@nestjs/core';
import { AuthModule } from '@management-auth/auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  await app.listen(5200);
}
bootstrap();
