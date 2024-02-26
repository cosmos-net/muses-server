import { SubModuleEntity } from '@module-sub-module/infrastructure/domain/sub-module-muses.entity';
import { ISubModuleRepository } from '@module-sub-module/domain/contracts/sub-module-repository';
import { TypeormRepository } from '@lib-commons/infrastructure/domain/typeorm/typeorm-repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { SubModule } from '@module-sub-module/domain/aggregate/sub-module';

@Injectable()
export class TypeOrmSubModuleRepository extends TypeormRepository<SubModuleEntity> implements ISubModuleRepository {
  constructor(
    @InjectRepository(SubModuleEntity)
    private readonly moduleRepository: MongoRepository<SubModuleEntity>,
  ) {
    super();
  }

  async searchOneBy(id: string, options: { withDeleted: false }): Promise<SubModule | null> {
    const subModuleFound = await this.moduleRepository.findOne({
      where: { _id: new ObjectId(id) },
      withDeleted: options.withDeleted,
    });

    if (!subModuleFound) {
      return null;
    }

    const subModule = new SubModule({
      ...subModuleFound,
      ...(subModuleFound.module && { module: subModuleFound.module.toHexString() }),
      id: subModuleFound._id.toHexString(),
    });

    return subModule;
  }
}
