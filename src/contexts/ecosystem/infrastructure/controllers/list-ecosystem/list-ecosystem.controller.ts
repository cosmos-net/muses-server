import { Controller, Logger } from '@nestjs/common';
import { ListEcosystemQuery } from '@context-ecosystem/application/use-cases/list-ecosystem/list-ecosystem.query';
import { ListEcosystemService } from '@context-ecosystem/application/use-cases/list-ecosystem/list-ecosystem.service';
import { ListEcosystemInputDto } from '@context-ecosystem/infrastructure/controllers/list-ecosystem/presentation/list-ecosystem-input.dto';
import { ListEcosystemOutputDto } from '@context-ecosystem/infrastructure/controllers/list-ecosystem/presentation/list-ecosystem-output.dto';
import { Operator } from '@core/domain/criteria/filter-operator';
import { Primitives } from '@core/domain/value-object/value-object';
import { IdentifierEnum } from '@module-common/domain/enums';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { ECOSYSTEM } from '@module-common/infrastructure/constants/message-patterns';

@Controller()
export class ListEcosystemController {
  private logger = new Logger(ListEcosystemController.name);

  constructor(private readonly listEcosystemService: ListEcosystemService) {}

  @MessagePattern({ cmd: ECOSYSTEM.LIST })
    async list(@Payload() dto: ListEcosystemInputDto): Promise<ListEcosystemOutputDto> {
      const { page, limit, offset, sort: orderType, orderBy, ...filtersParams } = dto;

      const filters = this.mapFilters(filtersParams);
      const withDeleted = filtersParams.isEnabled === false;

      const query = new ListEcosystemQuery({
        orderBy,
        orderType,
        limit,
        offset,
        filters,
        withDeleted,
      });

      const ecosystems = await this.listEcosystemService.process(query);

      const mapper = new ListEcosystemOutputDto(
        {
          list: ecosystems.items,
          total: ecosystems.totalItems,
        },
        {
          page,
          limit,
          offset,
        },
      );

      return mapper;
    
  }

  private mapFilters(filtersParams: Record<string, any> | undefined): Array<Map<string, Primitives>> {
    const mappers: Map<string, Primitives>[] = [];

    for (const key in filtersParams) {
      if (key in filtersParams) {
        const value = filtersParams[key];
        const map = new Map<string, Primitives>();

        if (value !== undefined || value !== null) {
          map.set(IdentifierEnum.VALUE, value);

          switch (key) {
            case 'name':
            case 'description':
              map.set(IdentifierEnum.FIELD, key);
              map.set(IdentifierEnum.OPERATOR, Operator.CONTAINS);
              break;
            case 'isEnabled':
              map.set(IdentifierEnum.FIELD, key);
              map.set(IdentifierEnum.OPERATOR, Operator.EQUAL);
              break;
            case 'createdAtFrom':
              map.set(IdentifierEnum.FIELD, 'createdAt');
              map.set(IdentifierEnum.OPERATOR, Operator.GTE);
              break;
            case 'createdAtTo':
              map.set(IdentifierEnum.FIELD, 'createdAt');
              map.set(IdentifierEnum.OPERATOR, Operator.LTE);
              break;
            default:
              map.set(IdentifierEnum.OPERATOR, Operator.CONTAINS);
              break;
          }

          mappers.push(map);
        }
      }
    }

    return mappers;
  }
}
