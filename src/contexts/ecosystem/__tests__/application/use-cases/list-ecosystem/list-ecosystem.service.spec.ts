/* eslint-disable hexagonal-architecture/enforce */
import { Test, TestingModule } from "@nestjs/testing";
import { ListEcosystemService } from "@context-ecosystem/application/use-cases/list-ecosystem/list-ecosystem.service";
import { ECOSYSTEM_REPOSITORY } from "@context-ecosystem/application/constants/injection-token";
import { ListEcosystemQuery } from "@context-ecosystem/application/use-cases/list-ecosystem/list-ecosystem.query";
import { ListEcosystem } from "@context-ecosystem/domain/list-ecosystem";
import { Criteria } from "@core/domain/criteria/criteria";
import { OrderTypes } from '@core/domain/criteria/order-type';

describe("ListEcosystemService", () => {
  let service: ListEcosystemService;
  let mockEcosystemRepository: {
    matching: jest.Mock;
  };

  beforeEach(async () => {
    mockEcosystemRepository = {
      matching: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListEcosystemService,
        {
          provide: ECOSYSTEM_REPOSITORY,
          useValue: mockEcosystemRepository,
        },
      ],
    }).compile();

    service = module.get<ListEcosystemService>(ListEcosystemService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return ecosystem list with default parameters", async () => {
    // Arrange
    const mockEcosystems = new ListEcosystem(
      [
        {
          id: "eco-1",
          name: "Ecosystem 1",
          description: "Description 1",
          isEnabled: true,
          projects: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "eco-2",
          name: "Ecosystem 2",
          description: "Description 2",
          isEnabled: false,
          projects: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ],
      2
    );
    mockEcosystemRepository.matching.mockResolvedValue(mockEcosystems);

    const query = new ListEcosystemQuery({
      filters: [],
      limit: 10,
      offset: 0,
    });

    // Act
    const result = await service.process(query);

    // Assert
    expect(mockEcosystemRepository.matching).toHaveBeenCalledWith(
      expect.any(Criteria)
    );
    expect(result).toBe(mockEcosystems);
    expect(result.items.length).toBe(2);
    expect(result.totalItems).toBe(2);
  });

  it("should apply filters, order, limit and offset", async () => {
    // Arrange
    const mockEcosystems = new ListEcosystem(
      [
        {
          id: "eco-1",
          name: "Ecosystem 1",
          description: "Description 1",
          isEnabled: true,
          projects: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ],
      1
    );
    mockEcosystemRepository.matching.mockResolvedValue(mockEcosystems);

    // Create proper filter format with field, operator, and value
    const filtersMap = new Map<string, string>();
    filtersMap.set("field", "isEnabled");
    filtersMap.set("operator", "=");
    filtersMap.set("value", "true");
    
    const query = new ListEcosystemQuery({
      filters: [filtersMap],
      orderBy: "name",
      orderType: OrderTypes.ASC,
      limit: 5,
      offset: 2,
      withDeleted: true,
    });

    // Act
    const result = await service.process(query);

    // Assert
    expect(mockEcosystemRepository.matching).toHaveBeenCalledWith(
      expect.objectContaining({
        limit: 5,
        offset: 2,
        withDeleted: true,
      })
    );
    
    // Verify that Criteria was constructed correctly
    const criteriaArg = mockEcosystemRepository.matching.mock.calls[0][0];
    expect(criteriaArg).toBeInstanceOf(Criteria);
    expect(criteriaArg.limit).toBe(5);
    expect(criteriaArg.offset).toBe(2);
    expect(criteriaArg.withDeleted).toBe(true);
    
    expect(result).toBe(mockEcosystems);
    expect(result.items.length).toBe(1);
    expect(result.totalItems).toBe(1);
  });

  it("should handle empty result", async () => {
    // Arrange
    const mockEmptyEcosystems = new ListEcosystem([], 0);
    mockEcosystemRepository.matching.mockResolvedValue(mockEmptyEcosystems);

    // Create proper filter format for empty result test
    const emptyResultFilterMap = new Map<string, string>();
    emptyResultFilterMap.set("field", "name");
    emptyResultFilterMap.set("operator", "=");
    emptyResultFilterMap.set("value", "NonExistent");
    
    const query = new ListEcosystemQuery({
      filters: [emptyResultFilterMap],
    });

    // Act
    const result = await service.process(query);

    // Assert
    expect(mockEcosystemRepository.matching).toHaveBeenCalled();
    expect(result.items.length).toBe(0);
    expect(result.totalItems).toBe(0);
  });
});
