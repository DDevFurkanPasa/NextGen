# Strapi-NextGen Framework v0.1.0 - Release Notes

**Release Date**: November 4, 2025  
**Status**: Production-Ready  
**License**: GPL-3.0

---

## 🎉 Welcome to Strapi-NextGen Framework!

We're excited to announce the first production-ready release of Strapi-NextGen Framework - a complete, type-safe solution for integrating Strapi v4 CMS with Next.js 14+ App Router.

## 🚀 What's New

This is the **initial release** featuring a complete two-layer architecture:

### Data Layer (SDK)
- **Automatic Cache Tagging** - Built-in ISR cache management
- **GraphQL-First** - Lightweight client with type safety
- **Query Methods** - `getPage()`, `getCollection()`, `getGlobal()`, `rawQuery()`
- **i18n Support** - Full internationalization
- **Draft Mode** - Automatic preview mode detection

### Presentation Layer (Renderer)
- **Dynamic Zone Rendering** - `<StrapiRenderer />` component
- **Error Boundaries** - Individual boundaries per component
- **Zod Validation** - Runtime validation with 3 modes
- **Development Error UI** - Detailed error messages
- **Production Graceful Degradation** - Silent failures

### Advanced Features
- **SEO Optimization** - `generateStrapiMetadata()` for Next.js metadata
- **Image Optimization** - `<StrapiImage />` with next/image integration
- **Webhook Revalidation** - `createStrapiRevalidator()` for on-demand ISR
- **Preview Mode** - `createPreviewHandler()` for draft content

### Documentation
- **Comprehensive README** - Quick start and API reference
- **Migration Guide** - Step-by-step upgrade from manual setup
- **Usage Examples** - Real-world scenarios (blog, e-commerce, multilingual)
- **Contributing Guidelines** - Community contribution guide

## 📦 Installation

```bash
npm install strapi-nextgen-framework graphql graphql-request zod
```

## 🎯 Quick Start

```typescript
// 1. Initialize SDK
import { createStrapiSDK } from 'strapi-nextgen-framework';

const strapiClient = createStrapiSDK({
  url: process.env.STRAPI_URL!,
  token: process.env.STRAPI_TOKEN,
});

// 2. Fetch data
const page = await strapiClient.getPage('home');

// 3. Render with automatic error handling
import { StrapiRenderer } from 'strapi-nextgen-framework';

<StrapiRenderer 
  data={page.attributes.dynamicZone} 
  map={componentMap}
/>
```

## 🔑 Key Features

### Type Safety
- Full TypeScript support
- Auto-generated GraphQL types
- Exported type definitions

### Performance
- Automatic cache tagging
- Tree-shakeable exports
- Minimal bundle size
- Efficient GraphQL queries

### Developer Experience
- Zero-config defaults
- Detailed error messages in dev
- JSDoc comments on all APIs
- Real-world examples

### Production Ready
- Error boundaries
- Graceful degradation
- Optional validation
- Performance optimized

## 📊 Technical Specifications

- **Bundle Formats**: CommonJS + ES Modules
- **TypeScript**: v5.3+
- **Next.js**: v14.0+
- **React**: v18.2+
- **Strapi**: v4 with GraphQL plugin

## 🎓 Learning Resources

- **[README.md](./README.md)** - Complete API reference
- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - Upgrade from manual setup
- **[EXAMPLES.md](./EXAMPLES.md)** - Real-world usage patterns
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution guidelines

## 🐛 Known Issues

None currently reported. This is a stable production release.

## 🔮 Future Enhancements

Planned for future releases:
- Unit tests for SDK functions
- Integration tests for Strapi connection
- Component tests for renderer
- CI/CD pipeline
- Additional examples and templates

## 🤝 Contributing

We welcome contributions! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

This project is licensed under the GNU General Public License v3.0.  
See [LICENSE](./LICENSE) for details.

## 🙏 Acknowledgments

Developed with ❤️ by fuqom (@DDevFurkanPasa)

Special thanks to:
- The Strapi community
- The Next.js team
- All early adopters and testers

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/DDevFurkanPasa/NextGen/issues)
- **Discussions**: [GitHub Discussions](https://github.com/DDevFurkanPasa/NextGen/discussions)
- **Documentation**: [README.md](./README.md)

---

**Ready to get started?** Check out the [Quick Start Guide](./README.md#quick-start)!

**Upgrading from manual setup?** See the [Migration Guide](./MIGRATION_GUIDE.md)!

---

🎉 **Happy coding with Strapi-NextGen Framework!** 🎉
