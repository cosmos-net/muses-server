/* eslint-disable hexagonal-architecture/enforce */
import { CreateEcosystemCommand } from '@context-ecosystem/application/use-cases/create-ecosystem/create-ecosystem.command';

describe('CreateEcosystemCommand', () => {
  it('should create a command with all properties', () => {
    // Arrange & Act
    const command = new CreateEcosystemCommand({
      name: 'Test Ecosystem',
      description: 'Test Description',
      isEnabled: true,
    });

    // Assert
    expect(command).toBeDefined();
    expect(command.name).toBe('Test Ecosystem');
    expect(command.description).toBe('Test Description');
    expect(command.isEnabled).toBe(true);
  });

  it('should create a command with only name', () => {
    // Arrange & Act
    const command = new CreateEcosystemCommand({
      name: 'Test Ecosystem',
    });

    // Assert
    expect(command).toBeDefined();
    expect(command.name).toBe('Test Ecosystem');
    expect(command.description).toBeUndefined();
    expect(command.isEnabled).toBeUndefined();
  });

  it('should create an empty command if no props are provided', () => {
    // Arrange & Act
    const command = new CreateEcosystemCommand({});

    // Assert
    expect(command).toBeDefined();
    expect(command.name).toBeUndefined();
    expect(command.description).toBeUndefined();
    expect(command.isEnabled).toBeUndefined();
  });
});
