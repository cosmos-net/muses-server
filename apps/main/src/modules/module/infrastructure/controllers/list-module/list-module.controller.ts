import { ListModuleService } from '@module-module/application/use-cases/list-module/list-module.service';
import { Controller, Get, Logger, Query } from '@nestjs/common';
import { ListModuleInputDto } from '@module-module/infrastructure/controllers/list-module/presentation/list-module-input.dto';
import { ListModuleOutputDto } from '@module-module/infrastructure/controllers/list-module/presentation/list-module-output.dto';
import { ListModuleQuery } from '@module-module/application/use-cases/list-module/list-module.query';
import { ExceptionManager } from '@lib-commons/domain/exception-manager';
import { Primitives } from '@lib-commons/domain/value-object/value-object';
import { Operator } from '@lib-commons/domain/criteria/filter-operator';
import { IdentifierEnum } from '@module-common/domain/enums';

@Controller('module/')
export class ListModuleController {
  private readonly logger = new Logger(ListModuleController.name);
  constructor(private readonly listModuleService: ListModuleService) {}

  @Get('list/')
  async list(@Query() dto: ListModuleInputDto): Promise<ListModuleOutputDto> {
    try {
      const { page, limit, offset, sort: orderType, orderBy, ...filterParams } = dto;

      const filters = this.mapFilters(filterParams);
      const withDeleted = filterParams.isEnabled === false;

      const query = new ListModuleQuery({
        orderBy,
        orderType,
        limit,
        offset,
        filters,
        withDeleted,
      });

      const modules = await this.listModuleService.process(query);

      const mapper = new ListModuleOutputDto(
        {
          list: modules.items,
          total: modules.totalItems,
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

  private mapFilters(filterParams: Record<string, any> | undefined): Array<Map<string, Primitives>> {
    const mappers: Map<string, Primitives>[] = [];

    for (const key in filterParams) {
      if (key in filterParams) {
        const value = filterParams[key];
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
            case 'projects':
              map.set(IdentifierEnum.FIELD, 'project');
              map.set(IdentifierEnum.OPERATOR, Operator.IN);
              break;
            case 'subModules':
              map.set(IdentifierEnum.FIELD, 'subModules');
              map.set(IdentifierEnum.OPERATOR, Operator.IN);
              break;
            case 'actions':
              map.set(IdentifierEnum.FIELD, 'actions');
              map.set(IdentifierEnum.OPERATOR, Operator.IN);
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
