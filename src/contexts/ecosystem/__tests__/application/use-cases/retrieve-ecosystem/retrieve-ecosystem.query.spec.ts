/* eslint-disable hexagonal-architecture/enforce */
import { RetrieveEcosystemQuery } from "@context-ecosystem/application/use-cases/retrieve-ecosystem/retrieve-ecosystem.query";

describe("RetrieveEcosystemQuery", () => {
  it("should create an instance with default values", () => {
    // Act
    const query = new RetrieveEcosystemQuery({});

    // Assert
    expect(query).toBeDefined();
    expect(query.id).toBeUndefined();
    expect(query.withDisabled).toBeUndefined();
  });

  it("should create an instance with provided values", () => {
    // Arrange
    const props = {
      id: "eco-123",
      withDisabled: true,
    };

    // Act
    const query = new RetrieveEcosystemQuery(props);

    // Assert
    expect(query.id).toBe("eco-123");
    expect(query.withDisabled).toBe(true);
  });

  it("should handle partial values", () => {
    // Arrange
    const props = {
      id: "eco-456",
    };

    // Act
    const query = new RetrieveEcosystemQuery(props);

    // Assert
    expect(query.id).toBe("eco-456");
    expect(query.withDisabled).toBeUndefined();
  });
});
