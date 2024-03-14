import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetActionController } from '@module-action/infrastructure/controllers/get-action/get-action.controller';
import { GetActionService } from '@module-action/application/use-cases/get-action/ge-action.service';
import { ACTION_REPOSITORY } from '@module-action/application/constants/injection-token';
import { TypeOrmActionRepository } from '@module-action/infrastructure/repositories/typeorm-action.repository';
import { ActionEntity } from '@module-action/infrastructure/domain/action-muses.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActionEntity])],
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
