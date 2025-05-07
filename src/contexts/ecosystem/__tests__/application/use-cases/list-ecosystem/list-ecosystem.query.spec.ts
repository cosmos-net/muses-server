/* eslint-disable hexagonal-architecture/enforce */
import { ListEcosystemQuery } from "@context-ecosystem/application/use-cases/list-ecosystem/list-ecosystem.query";

describe("ListEcosystemQuery", () => {
  it("should create an instance with default values", () => {
    // Act
    const query = new ListEcosystemQuery({});

    // Assert
    expect(query).toBeDefined();
    expect(query.withDeleted).toBe(false);
    expect(query.filters).toBeUndefined();
    expect(query.orderBy).toBeUndefined();
    expect(query.orderType).toBeUndefined();
    expect(query.limit).toBeUndefined();
    expect(query.offset).toBeUndefined();
  });

  it("should create an instance with provided values", () => {
    // Arrange
    const filters = [new Map([["isEnabled", true]])];
    const props = {
      filters,
      orderBy: "name",
      orderType: "desc",
      limit: 20,
      offset: 10,
      withDeleted: true,
    };

    // Act
    const query = new ListEcosystemQuery(props);

    // Assert
    expect(query.filters).toBe(filters);
    expect(query.orderBy).toBe("name");
    expect(query.orderType).toBe("desc");
    expect(query.limit).toBe(20);
    expect(query.offset).toBe(10);
    expect(query.withDeleted).toBe(true);
  });

  it("should handle partial values", () => {
    // Arrange
    const props = {
      limit: 15,
      orderBy: "createdAt",
    };

    // Act
    const query = new ListEcosystemQuery(props);

    // Assert
    expect(query.limit).toBe(15);
    expect(query.orderBy).toBe("createdAt");
    expect(query.orderType).toBeUndefined();
    expect(query.offset).toBeUndefined();
    expect(query.filters).toBeUndefined();
    expect(query.withDeleted).toBe(false); // Default value
  });
});
