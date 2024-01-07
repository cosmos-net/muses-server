import { BadRequestException, Controller, Get, HttpException, Logger, Query, ValidationPipe } from '@nestjs/common';
import { ListEcosystemQuery, ListEcosystemService } from '@module-eco/application';
import { ListEcosystemInputDto, ListEcosystemOutputDto } from '@module-eco/infrastructure';
import { ExceptionManager } from '@lib-commons/domain/exception-manager';

@Controller('management-ecosystem/')
export class ListEcosystemController {
  private readonly logger = new Logger(ListEcosystemController.name);
  constructor(private readonly listEcosystemService: ListEcosystemService) {}

  @Get('list')
  async list(
    @Query(new ValidationPipe({ transform: true })) dto: ListEcosystemInputDto,
  ): Promise<ListEcosystemOutputDto> {
    try {
      const { page, limit, offset, sort, orderBy, ...filters } = dto;
      const params: ListEcosystemQuery = {
        order: {
          by: orderBy,
          direction: sort,
        },
        pagination: {
          page,
          limit,
          offset,
        },
      };

      if (filters) {
        Object.keys(filters).forEach((key) => {
          if (key in filters) {
            params.filter = {
              by: {
                ...params.filter?.by,
                [key]: filters[key],
              },
            };
          }
        });
      }

      const command = new ListEcosystemQuery(params);

      const domain = await this.listEcosystemService.process(command);

      const mapper = new ListEcosystemOutputDto(
        {
          list: domain.items,
          total: domain.totalItems,
        },
        {
          page,
          limit,
          offset,
        },
      );

      return mapper;
    } catch (error) {
      throw ExceptionManager.createSignatureError(error);
    }
  }
}
