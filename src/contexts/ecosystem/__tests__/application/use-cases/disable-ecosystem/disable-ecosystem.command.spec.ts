/* eslint-disable hexagonal-architecture/enforce */
import { DisableEcosystemCommand } from "@context-ecosystem/application/use-cases/disable-ecosystem/disable-ecosystem.command";

describe("DisableEcosystemCommand", () => {
  it("should create an instance with default values", () => {
    // Act
    const command = new DisableEcosystemCommand({});

    // Assert
    expect(command).toBeDefined();
    expect(command.id).toBeUndefined();
  });

  it("should create an instance with provided values", () => {
    // Arrange
    const props = {
      id: "eco-123",
    };

    // Act
    const command = new DisableEcosystemCommand(props);

    // Assert
    expect(command.id).toBe("eco-123");
  });
});
