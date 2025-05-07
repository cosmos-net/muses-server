import { Controller, Logger } from '@nestjs/common';
import { ListProjectService } from '@module-project/application/use-cases/list-project/list-project.service';
import { ListProjectInputDto } from './presentation/list-project-input.dto';
import { ListProjectOutputDto } from './presentation/list-project-output.dto';
import { Primitives } from '@core/domain/value-object/value-object';
import { Operator } from '@core/domain/criteria/filter-operator';
import { ListProjectQuery } from '@module-project/application/use-cases/list-project/list-project.query';
import { IdentifierEnum } from '@module-common/domain/enums';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class ListProjectController {
  private readonly logger = new Logger(ListProjectController.name);
  constructor(private readonly listProjectService: ListProjectService) {}

  @MessagePattern({ cmd: 'muses.project.list' })
  async list(@Payload() dto: ListProjectInputDto): Promise<ListProjectOutputDto> {
      const { page, limit, offset, sort: orderType, orderBy, ...filtersParams } = dto;

      const filters = this.mapFilters(filtersParams);
      const withDeleted = filtersParams.isEnabled === false;

      const query = new ListProjectQuery({
        orderBy,
        orderType,
        limit,
        offset,
        filters,
        withDeleted,
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
            case 'ecosystems':
              map.set(IdentifierEnum.FIELD, 'ecosystem');
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
