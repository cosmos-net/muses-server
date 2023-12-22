import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  Logger,
} from '@nestjs/common';
import {
  ListEcosystemQuery,
  ListEcosystemService,
} from '@module-eco/application';
import {
  ListEcosystemInputDto,
  ListEcosystemOutputDto,
} from '@module-eco/infrastructure';

@Controller('management-ecosystem/')
export class ListEcosystemController {
  private readonly logger = new Logger(ListEcosystemController.name);
  constructor(private readonly listEcosystemService: ListEcosystemService) {}

  @Get('list')
  async list(
    @Body() dto: ListEcosystemInputDto,
  ): Promise<ListEcosystemOutputDto> {
    try {
      const { page, limit, take, sort, orderBy, filterBy } = dto;
      const paramsFilterBy: Record<string, unknown> = {};
      const params: Record<string, unknown> = {
        order: {
          by: orderBy,
          direction: sort,
        },
        pagination: {
          page,
          limit,
          take,
        },
      };

      if (filterBy) {
        Object.keys(filterBy).forEach((key) => {
          paramsFilterBy[key] = filterBy[key];
        });

        params.filter = {
          by: paramsFilterBy,
        };
      }

      const command = new ListEcosystemQuery(params);

      const domain = await this.listEcosystemService.process(command);

      return new ListEcosystemOutputDto(domain.entities(), {
        page,
        limit,
        take,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      const err = error as Error;
      this.logger.error(err.message, err.stack);
      throw new BadRequestException(err.message, err.name);
    }
  }
}
