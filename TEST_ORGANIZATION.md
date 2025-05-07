# Test Structure Organization

## Overview

This project follows a hexagonal architecture pattern, and test files are organized to mirror the application structure. We've adopted a convention where each context has its own `__tests__` folder with subdirectories mirroring the application's architectural layers. The project uses unit tests only, with no end-to-end tests.

## Test Organization Structure

```
src/
└── contexts/
    └── {context-name}/         # e.g., ecosystem
        ├── __tests__/          # All tests for this context
        │   ├── domain/         # Tests for domain layer
        │   │   ├── aggregate/
        │   │   ├── entity/
        │   │   └── value-object/
        │   ├── application/    # Tests for application layer
        │   │   └── use-cases/
        │   │       └── {use-case-name}/
        │   │           ├── {use-case-name}.command.spec.ts
        │   │           └── {use-case-name}.service.spec.ts
        │   └── infrastructure/ # Tests for infrastructure layer
        │       ├── controller/
        │       └── repository/
        ├── domain/             # Domain layer implementation
        ├── application/        # Application layer implementation
        └── infrastructure/     # Infrastructure layer implementation
```

## Test Types

1. **Domain Tests**: Focus on testing domain aggregates, entities, and value objects in isolation.
2. **Application Tests**: Test use cases (services, commands, queries) with mocked dependencies.
3. **Infrastructure Tests**: Test controllers, repositories, and other infrastructure concerns.

## Naming Conventions

- Test files should be named after the file they test with a `.spec.ts` suffix.
- For domain aggregates: `{aggregate-name}.spec.ts`
- For use cases: `{use-case-name}.service.spec.ts` or `{use-case-name}.command.spec.ts`

## Best Practices

- Keep tests isolated and independent.
- Mock external dependencies to focus on the unit being tested.
- Structure test files with describe blocks that mirror the functionality being tested.
- Follow the Arrange-Act-Assert (AAA) pattern within test cases.
- Use descriptive test names that explain the behavior being tested.

## Migration Notes

This project has undergone two significant testing structure changes:

1. **Context-based Organization**: Tests were migrated from a flat structure in the root `__tests__` folder to a context-based organization. This change improved test organization and made it easier to locate tests related to specific modules.

2. **Removal of E2E Tests**: End-to-end tests have been removed from the project. The project now focuses exclusively on unit tests organized within each context's `__tests__` directory. This approach streamlines testing by focusing on thorough unit testing of each component in isolation.
