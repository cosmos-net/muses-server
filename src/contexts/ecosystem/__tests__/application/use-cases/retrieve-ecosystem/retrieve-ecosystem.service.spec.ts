/* eslint-disable hexagonal-architecture/enforce */
import { Test, TestingModule } from "@nestjs/testing";
import { RetrieveEcosystemService } from "@context-ecosystem/application/use-cases/retrieve-ecosystem/retrieve-ecosystem.service";
import { ECOSYSTEM_REPOSITORY } from "@context-ecosystem/application/constants/injection-token";
import { RetrieveEcosystemQuery } from "@context-ecosystem/application/use-cases/retrieve-ecosystem/retrieve-ecosystem.query";
import { Ecosystem } from "@context-ecosystem/domain/aggregate/ecosystem";

describe("RetrieveEcosystemService", () => {
  let service: RetrieveEcosystemService;
  let mockEcosystemRepository: {
    byIdOrFail: jest.Mock;
  };
  let mockEcosystem: Partial<Ecosystem>;

  beforeEach(async () => {
    mockEcosystem = {
      id: "eco-123",
      name: "Test Ecosystem",
      description: "Test Description",
      isEnabled: true,
    };

    mockEcosystemRepository = {
      byIdOrFail: jest.fn().mockResolvedValue(mockEcosystem),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RetrieveEcosystemService,
        {
          provide: ECOSYSTEM_REPOSITORY,
          useValue: mockEcosystemRepository,
        },
      ],
    }).compile();

    service = module.get<RetrieveEcosystemService>(RetrieveEcosystemService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should retrieve ecosystem by id", async () => {
    // Arrange
    const query = new RetrieveEcosystemQuery({
      id: "eco-123",
      withDisabled: false,
    });

    // Act
    const result = await service.process(query);

    // Assert
    expect(mockEcosystemRepository.byIdOrFail).toHaveBeenCalledWith("eco-123", false);
    expect(result).toBe(mockEcosystem);
  });

  it("should retrieve ecosystem by id including disabled ecosystems", async () => {
    // Arrange
    const query = new RetrieveEcosystemQuery({
      id: "eco-123",
      withDisabled: true,
    });

    // Act
    const result = await service.process(query);

    // Assert
    expect(mockEcosystemRepository.byIdOrFail).toHaveBeenCalledWith("eco-123", true);
    expect(result).toBe(mockEcosystem);
  });

  it("should throw an exception when ecosystem is not found", async () => {
    // Arrange
    mockEcosystemRepository.byIdOrFail.mockRejectedValue(new Error("Ecosystem not found"));
    const query = new RetrieveEcosystemQuery({
      id: "non-existent-id",
      withDisabled: false,
    });

    // Act & Assert
    await expect(service.process(query)).rejects.toThrow("Ecosystem not found");
  });
});
