/* eslint-disable hexagonal-architecture/enforce */
import { Test, TestingModule } from "@nestjs/testing";
import { DisableEcosystemService } from "@context-ecosystem/application/use-cases/disable-ecosystem/disable-ecosystem.service";
import { ECOSYSTEM_REPOSITORY } from "@context-ecosystem/application/constants/injection-token";
import { DisableEcosystemCommand } from "@context-ecosystem/application/use-cases/disable-ecosystem/disable-ecosystem.command";

describe("DisableEcosystemService", () => {
  let service: DisableEcosystemService;
  let mockEcosystemRepository: {
    byIdOrFail: jest.Mock;
    persist: jest.Mock;
  };
  let mockEcosystem: {
    disable: jest.Mock;
    id: string;
  };

  beforeEach(async () => {
    mockEcosystem = {
      disable: jest.fn(),
      id: "eco-123",
    };

    mockEcosystemRepository = {
      byIdOrFail: jest.fn().mockResolvedValue(mockEcosystem),
      persist: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DisableEcosystemService,
        {
          provide: ECOSYSTEM_REPOSITORY,
          useValue: mockEcosystemRepository,
        },
      ],
    }).compile();

    service = module.get<DisableEcosystemService>(DisableEcosystemService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should disable an ecosystem", async () => {
    // Arrange
    const command = new DisableEcosystemCommand({
      id: "eco-123",
    });

    // Act
    const result = await service.process(command);

    // Assert
    expect(mockEcosystemRepository.byIdOrFail).toHaveBeenCalledWith("eco-123", true);
    expect(mockEcosystem.disable).toHaveBeenCalled();
    expect(mockEcosystemRepository.persist).toHaveBeenCalledWith(mockEcosystem);
    expect(result).toBe(1); // Returns 1 to indicate success
  });

  it("should throw an error if ecosystem not found", async () => {
    // Arrange
    mockEcosystemRepository.byIdOrFail.mockRejectedValue(new Error("Ecosystem not found"));
    const command = new DisableEcosystemCommand({
      id: "non-existent-id",
    });

    // Act & Assert
    await expect(service.process(command)).rejects.toThrow("Ecosystem not found");
    expect(mockEcosystem.disable).not.toHaveBeenCalled();
    expect(mockEcosystemRepository.persist).not.toHaveBeenCalled();
  });

  it("should throw an error if ecosystem is already disabled", async () => {
    // Arrange
    mockEcosystem.disable.mockImplementation(() => {
      throw new Error("Ecosystem is already disabled");
    });
    const command = new DisableEcosystemCommand({
      id: "eco-123",
    });

    // Act & Assert
    await expect(service.process(command)).rejects.toThrow("Ecosystem is already disabled");
    expect(mockEcosystem.disable).toHaveBeenCalled();
    expect(mockEcosystemRepository.persist).not.toHaveBeenCalled();
  });
});
