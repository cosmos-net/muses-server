import { Controller, Logger } from '@nestjs/common';
import { ListResourceInputDto } from '@module-resource/infrastructure/controllers/list-resource/presentation/list-resource-input.dto';
import { ListResourceOutputDto } from '@module-resource/infrastructure/controllers/list-resource/presentation/list-resource-output.dto';
import { IdentifierEnum } from '@module-common/domain/enums';
import { Primitives } from '@core/domain/value-object/value-object';
import { Operator } from '@core/domain/criteria/filter-operator';
import { ListResourceQuery } from '@module-resource/application/use-cases/list-resource/list-resource.query';
import { ListResourceService } from '@module-resource/application/use-cases/list-resource/list-resource.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class ListResourceController {
  private logger = new Logger(ListResourceController.name);
  constructor(private readonly listResourceService: ListResourceService) {}

  @MessagePattern({ cmd: 'muses.resource.list' })
  async list(@Payload() dto: ListResourceInputDto): Promise<ListResourceOutputDto> {
      const { page, limit, offset, sort: orderType, orderBy, ...filtersParams } = dto;

      const filters = this.mapFilters(filtersParams);
      const withDeleted = filtersParams.isEnabled === false;

      const query = new ListResourceQuery({
        orderBy,
        orderType,
        limit,
        offset,
        filters,
        withDeleted,
      });

      const resources = await this.listResourceService.process(query);

      const mapper = new ListResourceOutputDto(
        {
          list: resources.items,
          total: resources.totalItems,
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

        if (value !== undefined && value !== null) {
          map.set(IdentifierEnum.VALUE, value);

          switch (key) {
            case 'name':
            case 'description':
            case 'endpoint':
            case 'method':
              map.set(IdentifierEnum.FIELD, key);
              map.set(IdentifierEnum.OPERATOR, Operator.CONTAINS);
              break;
            case 'isEnabled':
              map.set(IdentifierEnum.FIELD, key);
              map.set(IdentifierEnum.OPERATOR, Operator.EQUAL);
              break;
            case 'actions':
            case 'triggers':
              map.set(IdentifierEnum.FIELD, key);
              map.set(IdentifierEnum.OPERATOR, Operator.IN);
              break;
            case 'createdAtFrom':
            case 'updatedAtFrom':
            case 'deletedAtFrom':
              map.set(IdentifierEnum.FIELD, 'createdAt');
              map.set(IdentifierEnum.OPERATOR, Operator.GTE);
              break;
            case 'createdAtTo':
            case 'updatedAtTo':
            case 'deletedAtTo':
              map.set(IdentifierEnum.FIELD, 'createdAt');
              map.set(IdentifierEnum.OPERATOR, Operator.LTE);
              break;
          }

          mappers.push(map);
        }
      }
    }

    return mappers;
  }
}
