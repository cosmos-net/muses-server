import { TypeormRepository } from '@lib-commons/infrastructure/domain/typeorm/typeorm-repository';
import { Injectable } from '@nestjs/common';
import { ActionEntity } from '../domain/action-muses.entity';
import { IActionRepository } from '../../domain/contracts/action-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository, ObjectId } from 'typeorm';
import { Action } from '../../domain/aggregate/action';

@Injectable()
export class TypeOrmActionRepository extends TypeormRepository<ActionEntity> implements IActionRepository {
  constructor(
    @InjectRepository(ActionEntity)
    private readonly actionRepository: MongoRepository<ActionEntity>,
  ) {
    super();
  }

  async searchOneBy(id: string, options: { withDeleted: false }): Promise<Action | null> {
    const actionFound = await this.actionRepository.findOne({
      where: { _id: new ObjectId(id) },
      withDeleted: options.withDeleted,
    });

    if (!actionFound) {
      return null;
    }

    const action = new Action({
      ...actionFound,
      ...(actionFound.modules && { modules: actionFound.modules.map((module) => module.toHexString()) }),
      ...(actionFound.subModules && { subModules: actionFound.subModules.map((subModule) => subModule.toHexString()) }),
      id: actionFound._id.toHexString(),
    });

    return action;
  }
}
