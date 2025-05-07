/* eslint-disable hexagonal-architecture/enforce */
import { UpdateEcosystemCommand } from '@context-ecosystem/application/use-cases/update-ecosystem/update-ecosystem.command';

describe('UpdateEcosystemCommand', () => {
  it('should create a command with all properties', () => {
    // Arrange & Act
    const command = new UpdateEcosystemCommand({
      id: 'ecosystem-id-1',
      name: 'Test Ecosystem',
      description: 'Test Description',
      isEnabled: true,
    });

    // Assert
    expect(command).toBeDefined();
    expect(command.id).toBe('ecosystem-id-1');
    expect(command.name).toBe('Test Ecosystem');
    expect(command.description).toBe('Test Description');
    expect(command.isEnabled).toBe(true);
  });

  it('should create a command with only required properties', () => {
    // Arrange & Act
    const command = new UpdateEcosystemCommand({
      id: 'ecosystem-id-1',
    });

    // Assert
    expect(command).toBeDefined();
    expect(command.id).toBe('ecosystem-id-1');
    expect(command.name).toBeUndefined();
    expect(command.description).toBeUndefined();
    expect(command.isEnabled).toBeUndefined();
  });

  it('should create a command with partial properties', () => {
    // Arrange & Act
    const command = new UpdateEcosystemCommand({
      id: 'ecosystem-id-1',
      name: 'Test Ecosystem',
    });

    // Assert
    expect(command).toBeDefined();
    expect(command.id).toBe('ecosystem-id-1');
    expect(command.name).toBe('Test Ecosystem');
    expect(command.description).toBeUndefined();
    expect(command.isEnabled).toBeUndefined();
  });
});
