import { Controller, Get, Logger, Query } from '@nestjs/common';
import { ExceptionManager } from '@lib-commons/domain/exception-manager';
import { ListSubModuleService } from '@module-sub-module/application/use-cases/list-sub-module/list-sub-module.service';
import { ListSubModuleInputDto } from './presentation/list-sub-module-input.dto';
import { ListSubModuleOutputDto } from './presentation/list-sub-module-output.dto';
import { Primitives } from '@lib-commons/domain/value-object/value-object';
import { Operator } from '@lib-commons/domain/criteria/filter-operator';
import { IdentifierEnum } from '@module-common/domain/enums';

@Controller('sub-module/')
export class ListSubModuleController {
  private readonly logger = new Logger(ListSubModuleController.name);
  constructor(private readonly listSubModuleService: ListSubModuleService) {}

  @Get('list/')
  async list(@Query() dto: ListSubModuleInputDto): Promise<ListSubModuleOutputDto> {
    try {
      const { page, limit, offset, sort: orderType, orderBy, ...filtersParams } = dto;

      const filters = this.mapFilters(filtersParams);
      const withDeleted = filtersParams.isEnabled === false;

      const projects = await this.listSubModuleService.process({
        orderBy,
        orderType,
        limit,
        offset,
        filters,
        withDeleted,
      });

      const mapper = new ListSubModuleOutputDto(
        {
          list: projects.items,
          total: projects.totalItems,
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
