import { Controller, Get, Logger, Query, ValidationPipe } from '@nestjs/common';
import { ListEcosystemQuery, ListEcosystemService } from '@module-eco/application';
import { ListEcosystemInputDto, ListEcosystemOutputDto } from '@module-eco/infrastructure';
import { ExceptionManager } from '@lib-commons/domain/exception-manager';
import { Operator } from '@lib-commons/domain/criteria/filter-operator';
import { Primitives } from '@lib-commons/domain/value-object/value-object';

@Controller('ecosystem/')
export class ListEcosystemController {
  private logger = new Logger(ListEcosystemController.name);

  constructor(private readonly listEcosystemService: ListEcosystemService) {}

  @Get('list')
  async list(
    @Query(new ValidationPipe({ transform: true })) dto: ListEcosystemInputDto,
  ): Promise<ListEcosystemOutputDto> {
    try {
      const { page, limit, offset, sort: orderType, orderBy, ...filtersParams } = dto;

      const filters = this.mapFilters(filtersParams);

      const query = new ListEcosystemQuery({
        orderBy,
        orderType,
        limit,
        offset,
        filters,
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
    } catch (error) {
      this.logger.error(error);
      throw ExceptionManager.createSignatureError(error);
    }
  }

  private mapFilters(filtersParams: Record<string, any> | undefined): Array<Map<string, Primitives>> {
    enum IdentifierEnum {
      FIELD = 'field',
      VALUE = 'value',
      OPERATOR = 'operator',
    }

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
