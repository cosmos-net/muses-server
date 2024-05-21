import { ListActionService } from '@module-action/application/use-cases/list-actions/list-action.service';
import { Controller, Get, Logger, Query } from '@nestjs/common';
import { ListActionInputDto } from '@module-action/infrastructure/controllers/list-action/presentation/list-action-input.dto';
import { ListActionOutputDto } from '@module-action/infrastructure/controllers/list-action/presentation/list-action-output.dto';
import { ListActionQuery } from '@module-action/application/use-cases/list-actions/list-action.query';
import { ExceptionManager } from '@core/domain/exception-manager';
import { Primitives } from '@core/domain/value-object/value-object';
import { Operator } from '@core/domain/criteria/filter-operator';
import { IdentifierEnum } from '@module-common/domain/enums';

@Controller('action/')
export class ListActionController {
  private readonly logger = new Logger(ListActionController.name);
  constructor(private readonly listActionService: ListActionService) {}

  @Get('list/')
  async list(@Query() dto: ListActionInputDto): Promise<ListActionOutputDto> {
    try {
      const { page, limit, offset, sort: orderType, orderBy, ...filtersParams } = dto;

      const filters = this.mapFilters(filtersParams);
      const withDeleted = filtersParams.isEnabled === false;

      const query = new ListActionQuery({
        orderBy,
        orderType,
        limit,
        offset,
        filters,
        withDeleted,
      });

      const actions = await this.listActionService.process(query);

      const mapper = new ListActionOutputDto(
        {
          list: actions.items,
          total: actions.totalItems,
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
            case 'modules':
              map.set(IdentifierEnum.FIELD, 'modules');
              map.set(IdentifierEnum.OPERATOR, Operator.IN);
              break;
            case 'subModules':
              map.set(IdentifierEnum.FIELD, 'subModules');
              map.set(IdentifierEnum.OPERATOR, Operator.IN);
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
