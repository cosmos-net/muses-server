import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IEcosystemRepository } from '@management-main/modules/commons/domain/contracts/ecosystem-repository';
import { EcosystemEntity } from '@management-main/modules/commons/infrastructure/domain/ecosystem.entity';
import { Ecosystem } from '@management-main/modules/ecosystem/domain/ecosystem';

@Injectable()
export class TypeOrmMongoEcosystemRepository implements IEcosystemRepository {
  constructor(
    @InjectRepository(EcosystemEntity)
    private readonly ecosystemRepository: Repository<EcosystemEntity>,
  ) {}

  async persist(model: Ecosystem): Promise<void> {
    const ecosystem = await this.ecosystemRepository.save(model.entityRoot());
    model.hydrate(ecosystem);
  }

  async byNameOrFail(name: string): Promise<Ecosystem> {
    const ecosystem = await this.ecosystemRepository.findOneBy({ name });

    const domain = new Ecosystem(ecosystem);

    return domain;
  }

  async byIdOrFail(id: string): Promise<Ecosystem> {
    const ecosystem = await this.ecosystemRepository.findOneBy({
      id
    });

    const domain = new Ecosystem(ecosystem);

    return domain;
  }

}
