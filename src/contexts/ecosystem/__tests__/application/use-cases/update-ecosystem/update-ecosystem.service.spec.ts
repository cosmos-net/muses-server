/* eslint-disable hexagonal-architecture/enforce */
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateEcosystemService } from '@context-ecosystem/application/use-cases/update-ecosystem/update-ecosystem.service';
import { ECOSYSTEM_REPOSITORY } from '@context-ecosystem/application/constants/injection-token';
import { UpdateEcosystemCommand } from '@context-ecosystem/application/use-cases/update-ecosystem/update-ecosystem.command';
import { Ecosystem } from '@context-ecosystem/domain/aggregate/ecosystem';

describe('UpdateEcosystemService', () => {
  let service: UpdateEcosystemService;
  let mockEcosystem: {
    redescribe: jest.Mock;
    enable: jest.Mock;
    disable: jest.Mock;
    id: string;
    name: string;
    description: string;
    isEnabled: boolean;
  };
  let mockEcosystemRepository: {
    persist: jest.Mock;
    byIdOrFail: jest.Mock;
  };

  beforeEach(async () => {
    mockEcosystem = {
      redescribe: jest.fn(),
      enable: jest.fn(),
      disable: jest.fn(),
      id: 'ecosystem-id-1',
      name: 'Initial Name',
      description: 'Initial Description',
      isEnabled: true
    };

    mockEcosystemRepository = {
      persist: jest.fn(),
      byIdOrFail: jest.fn().mockResolvedValue(mockEcosystem),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateEcosystemService,
        {
          provide: ECOSYSTEM_REPOSITORY,
          useValue: mockEcosystemRepository,
        },
      ],
    }).compile();

    service = module.get<UpdateEcosystemService>(UpdateEcosystemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should update ecosystem name and description', async () => {
    // Arrange
    const command = new UpdateEcosystemCommand({
      id: 'ecosystem-id-1',
      name: 'Updated Name',
      description: 'Updated Description',
    });

    // Act
    const result = await service.process(command);

    // Assert
    expect(mockEcosystemRepository.byIdOrFail).toHaveBeenCalledWith('ecosystem-id-1', true);
    expect(mockEcosystem.redescribe).toHaveBeenCalledWith('Updated Name', 'Updated Description');
    expect(mockEcosystemRepository.persist).toHaveBeenCalledWith(mockEcosystem);
    expect(result).toBe(mockEcosystem);
  });

  it('should enable ecosystem when isEnabled is true', async () => {
    // Arrange
    const command = new UpdateEcosystemCommand({
      id: 'ecosystem-id-1',
      isEnabled: true,
    });

    // Act
    const result = await service.process(command);

    // Assert
    expect(mockEcosystemRepository.byIdOrFail).toHaveBeenCalledWith('ecosystem-id-1', true);
    expect(mockEcosystem.enable).toHaveBeenCalled();
    expect(mockEcosystemRepository.persist).toHaveBeenCalledWith(mockEcosystem);
    expect(result).toBe(mockEcosystem);
  });

  it('should disable ecosystem when isEnabled is false', async () => {
    // Arrange
    const command = new UpdateEcosystemCommand({
      id: 'ecosystem-id-1',
      isEnabled: false,
    });

    // Act
    const result = await service.process(command);

    // Assert
    expect(mockEcosystemRepository.byIdOrFail).toHaveBeenCalledWith('ecosystem-id-1', true);
    expect(mockEcosystem.disable).toHaveBeenCalled();
    expect(mockEcosystemRepository.persist).toHaveBeenCalledWith(mockEcosystem);
    expect(result).toBe(mockEcosystem);
  });

  it('should not call enable or disable when isEnabled is undefined', async () => {
    // Arrange
    const command = new UpdateEcosystemCommand({
      id: 'ecosystem-id-1',
      name: 'Updated Name',
    });

    // Act
    const result = await service.process(command);

    // Assert
    expect(mockEcosystemRepository.byIdOrFail).toHaveBeenCalledWith('ecosystem-id-1', true);
    expect(mockEcosystem.redescribe).toHaveBeenCalledWith('Updated Name', undefined);
    expect(mockEcosystem.enable).not.toHaveBeenCalled();
    expect(mockEcosystem.disable).not.toHaveBeenCalled();
    expect(mockEcosystemRepository.persist).toHaveBeenCalledWith(mockEcosystem);
    expect(result).toBe(mockEcosystem);
  });
});
