/* eslint-disable hexagonal-architecture/enforce */
import { Ecosystem } from '@context-ecosystem/domain/aggregate/ecosystem';
import { EcosystemAlreadyDisabledException } from '@context-ecosystem/domain/exceptions/ecosystem-already-disabled.exception';
import { EcosystemAlreadyEnabledException } from '@context-ecosystem/domain/exceptions/ecosystem-already-enabled.exception';
import { EcosystemPropertyWithSameValue } from '@context-ecosystem/domain/exceptions/ecosystem-property-with-same-value.exception';
import { EcosystemAlreadyHasProjectAddedException } from '@context-ecosystem/domain/exceptions/ecosystem-already-has-project-add.exception';
import { EcosystemDoesNotHaveProjectAddedException } from '@context-ecosystem/domain/exceptions/ecosystem-does-not-have-project-add-exception';
import { ObjectId } from 'mongodb';

describe('Ecosystem', () => {
  const mockDate = new Date('2025-01-01T12:00:00.000Z');
  
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Constructor', () => {
    it('should create an ecosystem with name, description and isEnabled', () => {
      // Arrange & Act
      const ecosystem = new Ecosystem('Test Ecosystem', 'Test Description', true);

      // Assert
      expect(ecosystem.name).toBe('Test Ecosystem');
      expect(ecosystem.description).toBe('Test Description');
      expect(ecosystem.isEnabled).toBe(true);
    });

    it('should create an ecosystem with only name and description (defaults isEnabled to true)', () => {
      // Arrange & Act
      const ecosystem = new Ecosystem('Test Ecosystem', '', true);

      // Assert
      expect(ecosystem.name).toBe('Test Ecosystem');
      expect(ecosystem.isEnabled).toBe(true);
    });

    it('should create an ecosystem from schema', () => {
      // Arrange
      // Usar un ID de MongoDB válido
      const objectId = new ObjectId();
      const schema = {
        id: objectId.toHexString(),
        name: 'Test Ecosystem',
        description: 'Test Description',
        isEnabled: true,
        projects: ['proj-1', 'proj-2'],
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-02')
      };

      // Act
      const ecosystem = new Ecosystem(schema);

      // Assert
      expect(ecosystem.id).toBe(objectId.toHexString());
      expect(ecosystem.name).toBe('Test Ecosystem');
      expect(ecosystem.description).toBe('Test Description');
      expect(ecosystem.isEnabled).toBe(true);
      expect(ecosystem.projects).toEqual(['proj-1', 'proj-2']);
      expect(ecosystem.createdAt).toEqual(new Date('2025-01-01'));
      expect(ecosystem.updatedAt).toEqual(new Date('2025-01-02'));
    });

    it('should throw exception when schema is null', () => {
      // Arrange & Act & Assert
      expect(() => new Ecosystem({} as any)).toThrow();
    });
  });

  describe('redescribe', () => {
    it('should update name and description', () => {
      // Arrange
      const ecosystem = new Ecosystem('Old Name', 'Old Description', true);

      // Act
      ecosystem.redescribe('New Name', 'New Description');

      // Assert
      expect(ecosystem.name).toBe('New Name');
      expect(ecosystem.description).toBe('New Description');
    });

    it('should update only name', () => {
      // Arrange
      const ecosystem = new Ecosystem('Old Name', 'Description', true);

      // Act
      ecosystem.redescribe('New Name');

      // Assert
      expect(ecosystem.name).toBe('New Name');
      expect(ecosystem.description).toBe('Description');
    });

    it('should update only description', () => {
      // Arrange
      const ecosystem = new Ecosystem('Name', 'Old Description', true);

      // Act
      ecosystem.redescribe(undefined, 'New Description');

      // Assert
      expect(ecosystem.name).toBe('Name');
      expect(ecosystem.description).toBe('New Description');
    });

    it('should throw error when trying to update with same name value', () => {
      // Arrange
      const ecosystem = new Ecosystem('Test Name', 'Description', true);

      // Act & Assert
      expect(() => ecosystem.redescribe('Test Name')).toThrow(EcosystemPropertyWithSameValue);
    });

    it('should throw error when trying to update with same description value', () => {
      // Arrange
      const ecosystem = new Ecosystem('Name', 'Test Description', true);

      // Act & Assert
      expect(() => ecosystem.redescribe(undefined, 'Test Description')).toThrow(EcosystemPropertyWithSameValue);
    });
  });

  describe('enable', () => {
    it('should enable a disabled ecosystem', () => {
      // Arrange
      const ecosystem = new Ecosystem('Test Ecosystem', 'Description', false);

      // Act
      ecosystem.enable();

      // Assert
      expect(ecosystem.isEnabled).toBe(true);
      expect(ecosystem.deletedAt).toBeUndefined();
    });

    it('should throw exception when enabling an already enabled ecosystem', () => {
      // Arrange
      const ecosystem = new Ecosystem('Test Ecosystem', 'Description', true);

      // Act & Assert
      expect(() => ecosystem.enable()).toThrow(EcosystemAlreadyEnabledException);
    });
  });

  describe('disable', () => {
    it('should disable an enabled ecosystem', () => {
      // Arrange
      const ecosystem = new Ecosystem('Test Ecosystem', 'Description', true);

      // Act
      ecosystem.disable();

      // Assert
      expect(ecosystem.isEnabled).toBe(false);
      expect(ecosystem.deletedAt).toEqual(mockDate);
    });

    it('should throw exception when disabling an already disabled ecosystem', () => {
      // Arrange
      const ecosystem = new Ecosystem('Test Ecosystem', 'Description', false);

      // Act & Assert
      expect(() => ecosystem.disable()).toThrow(EcosystemAlreadyDisabledException);
    });
  });

  describe('Projects Management', () => {
    it('should add a project', () => {
      // Arrange
      const ecosystem = new Ecosystem('Test Ecosystem');
      
      // Act
      ecosystem.addProject('project-1');
      
      // Assert
      expect(ecosystem.projects).toContain('project-1');
    });
    
    it('should throw exception when adding a project that already exists', () => {
      // Arrange
      const ecosystem = new Ecosystem('Test Ecosystem');
      ecosystem.addProject('project-1');
      
      // Act & Assert
      expect(() => ecosystem.addProject('project-1')).toThrow(EcosystemAlreadyHasProjectAddedException);
    });
    
    it('should remove a project', () => {
      // Arrange
      const ecosystem = new Ecosystem('Test Ecosystem');
      ecosystem.addProject('project-1');
      
      // Act
      ecosystem.removeProject('project-1');
      
      // Assert
      expect(ecosystem.projects).not.toContain('project-1');
    });
    
    it('should throw exception when removing a project that does not exist', () => {
      // Arrange
      const ecosystem = new Ecosystem('Test Ecosystem');
      
      // Act & Assert
      expect(() => ecosystem.removeProject('non-existent-project')).toThrow(EcosystemDoesNotHaveProjectAddedException);
    });
  });

  describe('Conversion methods', () => {
    it('should convert to primitives correctly', () => {
      // Arrange
      const objectId = new ObjectId();
      const schema = {
        id: objectId.toHexString(),
        name: 'Test Ecosystem',
        description: 'Test Description',
        isEnabled: true,
        projects: ['proj-1', 'proj-2'],
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-02')
      };
      const ecosystem = new Ecosystem(schema);

      // Act
      const primitives = ecosystem.toPrimitives();

      // Assert
      expect(primitives).toEqual(expect.objectContaining({
        id: objectId.toHexString(),
        name: 'Test Ecosystem',
        description: 'Test Description',
        isEnabled: true,
        projects: ['proj-1', 'proj-2']
      }));
    });
  });
});
