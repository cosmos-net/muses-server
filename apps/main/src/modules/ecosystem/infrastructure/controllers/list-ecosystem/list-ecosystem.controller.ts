import { BadRequestException, Controller, Get, HttpException, Logger, Query, ValidationPipe } from '@nestjs/common';
import { ListEcosystemQuery, ListEcosystemService } from '@module-eco/application';
import { ListEcosystemInputDto, ListEcosystemOutputDto } from '@module-eco/infrastructure';

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
      const paramsFilterBy: Record<string, unknown> = {};
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
          if (filters[key]) {
            paramsFilterBy[key] = filters[key];
          }
        });

        if (paramsFilterBy) {
          params.filter = {
            by: paramsFilterBy,
          };
        }
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
      if (error instanceof HttpException) throw error;
      const err = error as Error;
      this.logger.error(err.message, err.stack);
      throw new BadRequestException(err.message, err.name);
    }
  }
}
