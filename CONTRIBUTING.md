# Contributing to Strapi-NextGen Framework

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of experience level, background, or identity.

### Expected Behavior

- Be respectful and constructive in all interactions
- Welcome newcomers and help them get started
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Trolling, insulting, or derogatory remarks
- Publishing others' private information
- Any conduct that would be inappropriate in a professional setting

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- A Strapi v4 instance with GraphQL plugin (for testing)
- Next.js 14+ project (for testing)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/NextGen.git
   cd NextGen
   ```

3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/DDevFurkanPasa/NextGen.git
   ```

### Install Dependencies

```bash
npm install
```

### Build the Project

```bash
npm run build
```

This will compile both CommonJS and ESM outputs.

## Development Workflow

### Branch Naming

Use descriptive branch names with prefixes:

- `feature/` - New features (e.g., `feature/add-pagination-support`)
- `fix/` - Bug fixes (e.g., `fix/cache-tag-generation`)
- `docs/` - Documentation updates (e.g., `docs/improve-readme`)
- `refactor/` - Code refactoring (e.g., `refactor/simplify-renderer`)
- `test/` - Test additions or updates (e.g., `test/add-sdk-tests`)

### Making Changes

1. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our [coding standards](#coding-standards)

3. Build and test your changes:
   ```bash
   npm run build
   npm run type-check
   npm run lint
   ```

4. Commit your changes with a clear message:
   ```bash
   git commit -m "feat: add pagination support to getCollection"
   ```

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

**Examples:**
```
feat(sdk): add pagination support to getCollection method

Add limit and offset parameters to getCollection for paginated queries.
Includes automatic cache tag generation for paginated results.

Closes #123
```

```
fix(renderer): handle null component data gracefully

Previously, null component data would cause a runtime error.
Now returns null with a development warning.

Fixes #456
```

## Pull Request Process

### Before Submitting

1. **Update documentation** - If your changes affect the API, update:
   - README.md
   - JSDoc comments
   - EXAMPLES.md (if applicable)
   - MIGRATION_GUIDE.md (if breaking changes)

2. **Add tests** - Include tests for new features or bug fixes (when test suite is available)

3. **Run checks**:
   ```bash
   npm run build
   npm run type-check
   npm run lint
   ```

4. **Update CHANGELOG.md** - Add your changes under `[Unreleased]`

### Submitting the PR

1. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Open a Pull Request on GitHub

3. Fill out the PR template with:
   - Clear description of changes
   - Related issue numbers
   - Screenshots (if UI changes)
   - Breaking changes (if any)

4. Request review from maintainers

### PR Review Process

- Maintainers will review your PR within 1-2 weeks
- Address any requested changes
- Once approved, a maintainer will merge your PR

## Coding Standards

### TypeScript

- Use TypeScript for all code
- Avoid `any` types - use `unknown` or proper types
- Export all public types
- Use JSDoc comments for public APIs

### Code Style

We use ESLint and Prettier for code formatting:

```bash
# Check linting
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Format code
npm run format
```

**Key conventions:**
- Use single quotes for strings
- 2 spaces for indentation
- Semicolons required
- Trailing commas in multi-line structures
- Max line length: 100 characters

### File Organization

```
src/
├── sdk/              # Data layer
│   ├── index.ts      # Main SDK
│   ├── types.ts      # SDK types
│   └── README.md     # SDK documentation
├── renderer/         # Presentation layer
│   ├── index.tsx     # Renderer component
│   ├── types.ts      # Renderer types
│   └── README.md     # Renderer documentation
├── helpers/          # Helper functions
├── components/       # React components
├── revalidation/     # Webhook handlers
├── preview/          # Preview mode
└── types/            # Shared types
```

### Naming Conventions

- **Files**: kebab-case (e.g., `cache-tags.ts`)
- **Components**: PascalCase (e.g., `StrapiRenderer`)
- **Functions**: camelCase (e.g., `createStrapiSDK`)
- **Types/Interfaces**: PascalCase (e.g., `StrapiSDKConfig`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `DEFAULT_LOCALE`)

### Error Handling

- Use descriptive error messages
- Include context in development mode
- Graceful degradation in production
- Log errors appropriately based on environment

## Testing Guidelines

### Test Structure (When Available)

```typescript
describe('createStrapiSDK', () => {
  it('should create SDK instance with valid config', () => {
    // Test implementation
  });

  it('should throw error with invalid config', () => {
    // Test implementation
  });
});
```

### Test Coverage Goals

- SDK functions: 80%+ coverage
- Renderer components: 70%+ coverage
- Helper functions: 90%+ coverage

### Running Tests (When Available)

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Documentation

### JSDoc Comments

All public APIs must have JSDoc comments:

```typescript
/**
 * Creates a Strapi SDK instance with automatic cache tagging
 * 
 * @param config - SDK configuration options
 * @returns Configured SDK instance
 * 
 * @example
 * ```typescript
 * const sdk = createStrapiSDK({
 *   url: 'http://localhost:1337/graphql',
 *   token: 'your-token',
 * });
 * ```
 */
export function createStrapiSDK(config: StrapiSDKConfig): StrapiSDK {
  // Implementation
}
```

### README Updates

When adding features, update:
- Quick Start (if setup changes)
- API Reference (for new APIs)
- Examples (for new use cases)

### Example Code

- All examples must be complete and runnable
- Use TypeScript
- Include imports
- Show realistic use cases

## Questions?

- **Issues**: Open an issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact maintainers for private matters

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to Strapi-NextGen Framework! 🎉
