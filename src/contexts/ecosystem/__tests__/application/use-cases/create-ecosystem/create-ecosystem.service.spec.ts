/* eslint-disable hexagonal-architecture/enforce */
import { Test, TestingModule } from '@nestjs/testing';
import { CreateEcosystemService } from '@context-ecosystem/application/use-cases/create-ecosystem/create-ecosystem.service';
import { ECOSYSTEM_REPOSITORY } from '@context-ecosystem/application/constants/injection-token';
import { CreateEcosystemCommand } from '@context-ecosystem/application/use-cases/create-ecosystem/create-ecosystem.command';
import { EcosystemNameAlreadyUsedException } from '@context-ecosystem/domain/exceptions/ecosystem-name-already-used.exception';
import { Ecosystem } from '@context-ecosystem/domain/aggregate/ecosystem';

describe('CreateEcosystemService', () => {
  let service: CreateEcosystemService;
  let mockEcosystemRepository: {
    persist: jest.Mock;
    isNameAvailable: jest.Mock;
  };

  beforeEach(async () => {
    mockEcosystemRepository = {
      persist: jest.fn(),
      isNameAvailable: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateEcosystemService,
        {
          provide: ECOSYSTEM_REPOSITORY,
          useValue: mockEcosystemRepository,
        },
      ],
    }).compile();

    service = module.get<CreateEcosystemService>(CreateEcosystemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an ecosystem when name is available', async () => {
    // Arrange
    const command = new CreateEcosystemCommand({
      name: 'Test Ecosystem',
      description: 'Test Description',
      isEnabled: true,
    });
    mockEcosystemRepository.isNameAvailable.mockResolvedValue(true);

    // Act
    const result = await service.process(command);

    // Assert
    expect(result).toBeInstanceOf(Ecosystem);
    expect(result.name).toBe(command.name);
    expect(result.description).toBe(command.description);
    expect(result.isEnabled).toBe(command.isEnabled);
    expect(mockEcosystemRepository.isNameAvailable).toHaveBeenCalledWith(command.name);
    expect(mockEcosystemRepository.persist).toHaveBeenCalled();
  });

  it('should throw EcosystemNameAlreadyUsedException when name is not available', async () => {
    // Arrange
    const command = new CreateEcosystemCommand({
      name: 'Test Ecosystem',
      description: 'Test Description',
      isEnabled: true,
    });
    mockEcosystemRepository.isNameAvailable.mockResolvedValue(false);

    // Act & Assert
    await expect(service.process(command)).rejects.toThrow(EcosystemNameAlreadyUsedException);
    expect(mockEcosystemRepository.isNameAvailable).toHaveBeenCalledWith(command.name);
    expect(mockEcosystemRepository.persist).not.toHaveBeenCalled();
  });

  it('should create an ecosystem with isEnabled defaulting to true when not provided', async () => {
    // Arrange
    const command = new CreateEcosystemCommand({
      name: 'Test Ecosystem',
      description: 'Test Description',
    });
    mockEcosystemRepository.isNameAvailable.mockResolvedValue(true);

    // Act
    const result = await service.process(command);

    // Assert
    expect(result).toBeInstanceOf(Ecosystem);
    expect(result.name).toBe(command.name);
    expect(result.description).toBe(command.description);
    expect(result.isEnabled).toBe(true); // Default value
    expect(mockEcosystemRepository.isNameAvailable).toHaveBeenCalledWith(command.name);
    expect(mockEcosystemRepository.persist).toHaveBeenCalled();
  });
});
