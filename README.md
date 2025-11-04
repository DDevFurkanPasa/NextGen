# Strapi-NextGen Framework

> A high-performance, type-safe framework bridging Strapi CMS and Next.js with automatic cache management and dynamic rendering.

[![npm version](https://img.shields.io/npm/v/strapi-nextgen-framework.svg)](https://www.npmjs.com/package/strapi-nextgen-framework)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Features

- **Type-Safe by Default**: Automatic TypeScript type generation from GraphQL schemas
- **Performance First**: Built-in ISR with automatic cache tagging and on-demand revalidation
- **Developer Experience**: Intuitive APIs with minimal configuration
- **Resilient**: Error boundaries and Zod validation prevent page crashes
- **GraphQL-First**: No more complex REST `populate` queries
- **Next.js 14 Ready**: Full App Router support with React Server Components

## 📦 Installation

```bash
npm install strapi-nextgen-framework graphql graphql-request zod
```

### Dev Dependencies (for type generation)

```bash
npm install -D @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations @graphql-codegen/typescript-graphql-request
```

## 🏗️ Project Status

**Current Version**: 0.1.0 (Development)

This framework is currently under active development. The following phases are planned:

- [x] **Phase 1**: Project Setup ✅
- [ ] **Phase 2**: Data Layer (SDK)
- [ ] **Phase 3**: Presentation Layer (Renderer)
- [ ] **Phase 4**: Advanced Features
- [ ] **Phase 5**: Documentation & Examples
- [ ] **Phase 6**: Testing & Release

## 🎯 Quick Start (Coming Soon)

```typescript
// Initialize SDK
import { createStrapiSDK } from 'strapi-nextgen-framework';

const strapiClient = createStrapiSDK({
  url: process.env.STRAPI_URL!,
  token: process.env.STRAPI_TOKEN,
});

// Fetch data (fully typed!)
const homePage = await strapiClient.getPage('home');

// Render dynamic zones
import { StrapiRenderer } from 'strapi-nextgen-framework';

<StrapiRenderer 
  data={homePage.dynamicZone} 
  map={componentMap}
/>
```

## 📚 Core Concepts

### Data Layer (SDK)
- GraphQL-first querying with automatic type generation
- Automatic cache tagging for instant revalidation
- Escape hatches for advanced use cases

### Presentation Layer (Renderer)
- Dynamic zone rendering with component mapping
- Automatic error boundaries
- Zod validation in development mode

### Advanced Features
- SEO metadata generation
- Image optimization with next/image
- Webhook-based revalidation
- Preview/draft mode support

## 🛠️ Development

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Run tests
npm test

# Type checking
npm run type-check

# Lint
npm run lint
```

## 📖 Documentation

Full documentation will be available once the framework reaches beta status.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License

MIT © Furkan Pasa

## 🔗 Links

- [GitHub Repository](https://github.com/DDevFurkanPasa/NextGen)
- [Issue Tracker](https://github.com/DDevFurkanPasa/NextGen/issues)

---

**Note**: This framework requires Strapi v4 with GraphQL plugin and Next.js 14+ with App Router.
