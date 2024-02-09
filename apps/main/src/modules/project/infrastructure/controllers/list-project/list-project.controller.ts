import { Controller, Get, Logger, Query } from '@nestjs/common';
import { ExceptionManager } from '@lib-commons/domain/exception-manager';
import { ListProjectService } from '@app-main/modules/project/application/use-cases/list-project/list-project.service';
import { ListProjectInputDto } from './presentation/list-project-input.dto';
import { ListProjectOutputDto } from './presentation/list-project-output.dto';
import { Primitives } from '@lib-commons/domain/value-object/value-object';
import { Operator } from '@lib-commons/domain/criteria/filter-operator';
import { ListProjectQuery } from '@app-main/modules/project/application/use-cases/list-project/list-project.query';

@Controller('project/')
export class ListProjectController {
  private readonly logger = new Logger(ListProjectController.name);
  constructor(private readonly listProjectService: ListProjectService) {}

  @Get('list/')
  async list(@Query() dto: ListProjectInputDto): Promise<ListProjectOutputDto> {
    try {
      const { page, limit, offset, sort: orderType, orderBy, ...filtersParams } = dto;

      const filters = this.mapFilters(filtersParams);

      const query = new ListProjectQuery({
        orderBy,
        orderType,
        limit,
        offset,
        filters,
      });

      const projects = await this.listProjectService.process(query);

      const mapper = new ListProjectOutputDto(
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
