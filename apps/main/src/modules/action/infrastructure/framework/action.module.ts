import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetActionController } from '@module-action/infrastructure/controllers/get-action/get-action.controller';
import { GetActionService } from '@module-action/application/use-cases/get-action/ge-action.service';
import { ACTION_REPOSITORY } from '@module-action/application/constants/injection-token';
import { TypeOrmActionRepository } from '@module-action/infrastructure/repositories/typeorm-action.repository';
import { Action } from '@module-action/domain/aggregate/action';

@Module({
  imports: [TypeOrmModule.forFeature([Action])],
  controllers: [GetActionController],
  providers: [
    GetActionService,
    {
      provide: ACTION_REPOSITORY,
      useClass: TypeOrmActionRepository,
    },
  ],
})
export class MainActionModule {}
