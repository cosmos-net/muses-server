import { SubModuleEntity } from '@module-sub-module/infrastructure/domain/sub-module-muses.entity';
import { ISubModuleRepository } from '@module-sub-module/domain/contracts/sub-module-repository';
import { TypeormRepository } from '@lib-commons/infrastructure/domain/typeorm/typeorm-repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { SubModule } from '@module-sub-module/domain/aggregate/sub-module';
import { Criteria } from '@lib-commons/domain/criteria/criteria';
import { ListSubModule } from '@module-sub-module/domain/list-sub-module';

@Injectable()
export class TypeOrmSubModuleRepository extends TypeormRepository<SubModuleEntity> implements ISubModuleRepository {
  constructor(
    @InjectRepository(SubModuleEntity)
    private readonly subModuleRepository: MongoRepository<SubModuleEntity>,
  ) {
    super();
  }

  async searchOneBy(id: string, options: { withDeleted: false }): Promise<SubModule | null> {
    const subModuleFound = await this.subModuleRepository.findOne({
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

  async searchListBy(criteria: Criteria): Promise<ListSubModule> {
    const query = this.getQueryByCriteria(criteria);

    const [subModules, total] = await this.subModuleRepository.findAndCount(query);

    const subModulesClean = subModules.map((subModule) => ({
      ...subModule,
      ...(subModule.module && { module: subModule.module.toHexString() }),
      id: subModule._id.toHexString(),
    }));

    const list = new ListSubModule(subModulesClean, total);

    return list;
  }

}
