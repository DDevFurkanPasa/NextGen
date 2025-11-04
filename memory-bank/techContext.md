# Technical Context

## Technologies Used

### Core Framework
- **Next.js v14+**: App Router (required), React Server Components
- **React 18+**: For UI components and Error Boundaries
- **TypeScript 5+**: Full type safety across the stack

### Data Layer
- **graphql-request**: Lightweight GraphQL client (~5KB)
- **@graphql-codegen/cli**: Automatic TypeScript type generation
- **@graphql-codegen/typescript**: TypeScript plugin for codegen
- **@graphql-codegen/typescript-operations**: Operations type generation
- **@graphql-codegen/typescript-graphql-request**: SDK generation

### Validation & Safety
- **zod**: Runtime schema validation for component props
- **react-error-boundary**: Resilient error handling (or custom implementation)

### CMS Integration
- **Strapi v4**: Headless CMS with GraphQL plugin enabled
- **Strapi GraphQL Plugin**: Must be installed and configured in Strapi

### Image Optimization
- **next/image**: Built-in Next.js image optimization
- **sharp** (optional): For advanced image processing

## Development Setup

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm/yarn/pnpm package manager
- Strapi v4 instance with GraphQL plugin enabled
- Next.js 14+ project with App Router

### Installation

#### For Framework Development
```bash
# Clone repository
git clone https://github.com/[username]/strapi-nextgen-framework.git
cd strapi-nextgen-framework

# Install dependencies
npm install

# Build the library
npm run build

# Run tests
npm test

# Link for local development
npm link
```

#### For Consumer Projects
```bash
# Install the framework
npm install strapi-nextgen-framework

# Install peer dependencies
npm install graphql graphql-request zod

# Install dev dependencies for codegen
npm install -D @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations @graphql-codegen/typescript-graphql-request
```

### Build Commands
```bash
# Build the library (TypeScript compilation)
npm run build

# Watch mode for development
npm run build:watch

# Type checking only
npm run type-check

# Lint code
npm run lint

# Format code
npm run format
```

### Run Commands
```bash
# Run tests
npm test

# Run tests in watch mode
npm test:watch

# Run tests with coverage
npm test:coverage

# Generate documentation
npm run docs

# Publish to npm (CI/CD)
npm run release
```

### GraphQL Codegen Setup (Consumer Project)
```bash
# Create codegen.yml in project root
# (See Tool Usage Patterns section)

# Generate types and SDK
npm run codegen

# Watch mode for development
npm run codegen:watch
```

## Technical Constraints

### Version Requirements
- **Strapi**: v4.x only (v5 support via future adapter)
- **Next.js**: v14+ with App Router (Pages Router not supported)
- **Node.js**: v18+ (for Next.js compatibility)
- **React**: v18+ (for Server Components and Error Boundaries)

### Strapi Requirements
- GraphQL plugin must be enabled
- Webhook support required for revalidation
- CORS configured to allow Next.js domain
- API tokens with appropriate permissions

### Next.js Requirements
- App Router must be used (not Pages Router)
- Server Components for data fetching
- API Routes for webhook handler
- Environment variables for Strapi connection

### Performance Constraints
- GraphQL queries should be optimized (avoid deep nesting)
- Image optimization requires sharp (installed automatically by Next.js)
- Revalidation webhooks should have timeout < 10s

## Dependencies

### Production Dependencies
```json
{
  "graphql": "^16.8.0",
  "graphql-request": "^6.1.0",
  "zod": "^3.22.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0"
}
```

### Peer Dependencies (Required by Consumer)
```json
{
  "next": "^14.0.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0"
}
```

### Dev Dependencies
```json
{
  "@graphql-codegen/cli": "^5.0.0",
  "@graphql-codegen/typescript": "^4.0.0",
  "@graphql-codegen/typescript-operations": "^4.0.0",
  "@graphql-codegen/typescript-graphql-request": "^6.0.0",
  "@types/react": "^18.2.0",
  "@types/node": "^20.0.0",
  "typescript": "^5.0.0",
  "vitest": "^1.0.0",
  "@testing-library/react": "^14.0.0"
}
```

## API Keys & Environment Variables

### Required Environment Variables (Consumer Project)
```bash
# Strapi Connection
STRAPI_URL=https://your-strapi-instance.com/graphql
STRAPI_TOKEN=your_strapi_api_token_here

# Webhook Security
STRAPI_WEBHOOK_SECRET=your_webhook_secret_here

# Optional: Preview Mode
STRAPI_PREVIEW_SECRET=your_preview_secret_here

# Next.js (automatically available)
NODE_ENV=development|production
```

### Strapi Configuration
```javascript
// config/plugins.js in Strapi
module.exports = {
  graphql: {
    enabled: true,
    config: {
      endpoint: '/graphql',
      shadowCRUD: true,
      playgroundAlways: false,
      depthLimit: 10,
      amountLimit: 100,
    },
  },
};
```

## Tool Usage Patterns

### GraphQL Codegen Configuration
```yaml
# codegen.yml in consumer project root
schema: ${STRAPI_URL}
documents: './graphql/**/*.graphql'
generates:
  ./generated/graphql.ts:
    plugins:
      - typescript
      - typescript-operations
      - typescript-graphql-request
    config:
      rawRequest: false
      inlineFragmentTypes: combine
      skipTypename: false
      withHooks: false
      withHOC: false
      withComponent: false
```

### TypeScript Configuration
```json
// tsconfig.json recommendations
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@/*": ["./src/*"],
      "@/generated/*": ["./generated/*"]
    }
  }
}
```

### ESLint Configuration
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error', // Enforce no 'any' types
    '@typescript-eslint/no-unused-vars': 'warn',
  },
};
```

### Git Hooks (Husky)
```bash
# Always run codegen before commit
npx husky add .husky/pre-commit "npm run codegen && git add generated/"

# Type check before push
npx husky add .husky/pre-push "npm run type-check"
```

### Package Scripts (Consumer Project)
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "npm run codegen && next build",
    "start": "next start",
    "codegen": "graphql-codegen --config codegen.yml",
    "codegen:watch": "graphql-codegen --config codegen.yml --watch",
    "type-check": "tsc --noEmit"
  }
}
```

## Development Workflow

### Initial Setup Flow
1. Install framework: `npm install strapi-nextgen-framework`
2. Configure environment variables in `.env.local`
3. Create `codegen.yml` configuration
4. Write GraphQL queries in `/graphql/*.graphql`
5. Run `npm run codegen` to generate types
6. Initialize SDK in Next.js app
7. Create webhook handler at `/app/api/revalidate/route.ts`
8. Configure Strapi webhook to point to handler

### Daily Development Flow
1. Start Next.js dev server: `npm run dev`
2. Start codegen watcher: `npm run codegen:watch`
3. Edit GraphQL queries → types regenerate automatically
4. Edit components → hot reload in browser
5. Test revalidation → trigger webhook from Strapi

### Testing Strategy
- **Unit Tests**: Vitest for SDK functions and utilities
- **Integration Tests**: Test Strapi connection and data fetching
- **Component Tests**: React Testing Library for renderer components
- **E2E Tests**: Playwright for full revalidation flow (optional)

---
*This document defines the technical stack and development workflow.*
*Created: 2025-11-04*
*Last Updated: 2025-11-04 15:15 UTC+03:00*
