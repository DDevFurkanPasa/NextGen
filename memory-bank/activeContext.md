# Active Context

## Current Focus
✅ **SDK Unit Tests Complete!** - 56 tests passing (100%). SDK is fully tested with comprehensive coverage of initialization, configuration, cache tagging, and fetch wrapper functionality.

## Next Steps
1. ✅ Memory Bank populated with complete project design
2. ✅ Phase 1: Project Setup complete
3. ✅ Build system verified (CJS + ESM outputs working)
4. ✅ Phase 2: Data Layer (SDK) complete
5. ✅ Phase 3: Presentation Layer (Renderer) complete
6. ✅ Phase 4: Advanced Features complete
7. ✅ Phase 5: Documentation & Examples complete
8. Phase 6: Testing & Release 
   - Write unit tests for SDK
   - Write component tests for renderer
   - Set up CI/CD pipeline
   - Publish to npm registry
6. Implement Advanced Features:
   - `generateStrapiMetadata()` helper
   - `<StrapiImage />` component
   - `createStrapiRevalidator()` webhook handler
   - `createPreviewHandler()` for draft mode

## Active Decisions

### Project Structure Decision
- **Decision**: Build as npm library (not monorepo initially)
- **Rationale**: Simpler distribution, easier for consumers to install
- **Trade-off**: May need monorepo later for example projects

### Build System Decision
- **Decision**: Use TypeScript compiler (tsc) for build, Vitest for testing
- **Rationale**: Simple, standard tooling for library development
- **Alternative Considered**: tsup/esbuild (may migrate later for better DX)
- **Implementation**: Dual CJS (`dist/`) + ESM (`dist/esm/`) builds

### Unused Parameter Convention
- **Decision**: Prefix intentionally unused parameters with underscore (`_config`, `_props`)
- **Rationale**: Standard TypeScript pattern for placeholder functions, satisfies `noUnusedParameters` rule
- **Applied To**: Phase 3-4 placeholder functions (Phase 2 now fully implemented)

### Cache Tag Strategy (Phase 2)
- **Decision**: Generate consistent cache tags using pattern `strapi_{type}_{identifier}_{locale?}`
- **Rationale**: Enables precise on-demand revalidation via webhooks
- **Examples**: `strapi_page_home`, `strapi_collection_posts`, `strapi_global_header_fr`
- **Implementation**: `generateCacheTag()` utility with `parseCacheTag()` for debugging

### GraphQL Client Approach (Phase 2)
- **Decision**: Use `graphql-request` with custom fetch wrapper
- **Rationale**: Lightweight, type-safe, integrates with Next.js fetch caching
- **Trade-off**: Simplified queries in SDK; developers use graphql-codegen for typed queries
- **Benefit**: Automatic cache tagging without developer intervention

### Error Boundary Strategy (Phase 3)
- **Decision**: Wrap each dynamic component in individual Error Boundary
- **Rationale**: Isolate failures - one broken component doesn't crash entire page
- **Implementation**: Class component with getDerivedStateFromError and componentDidCatch
- **Dev Mode**: Show detailed error UI with stack traces
- **Prod Mode**: Hide errors or show fallback UI

### Validation Strategy (Phase 3)
- **Decision**: Optional Zod validation with 3 modes: 'error', 'warn', 'silent'
- **Rationale**: Runtime safety for CMS data, but configurable for performance
- **Default**: 'error' in development, 'silent' in production
- **Benefit**: Catch corrupt CMS data before it crashes components

### Export Strategy Decision
- **Decision**: Named exports for all utilities, default export for main SDK
- **Rationale**: Tree-shaking friendly, clear import statements
- **Example**: `import { createStrapiSDK, StrapiRenderer } from 'strapi-nextgen-framework'`

### Documentation Strategy
- **Decision**: JSDoc comments + auto-generated API docs + example repo
- **Rationale**: Types serve as inline docs, examples show real usage
- **Tools**: TypeDoc for API reference generation

## Learnings & Patterns

### Memory Bank Workflow
- Successfully followed AGENTS.md Plan Mode workflow
- Read all Memory Bank files before populating
- Documented project design in hierarchical structure
- Each file builds on previous: projectbrief → productContext/systemPatterns/techContext → activeContext

### Framework Design Insights
- **Type Safety is Non-Negotiable**: GraphQL codegen + Zod validation = zero `any` types
- **Performance by Default**: Automatic cache tagging removes cognitive load
- **Resilience Over Perfection**: Error Boundaries prevent cascading failures
- **Escape Hatches are Critical**: `rawQuery()` prevents framework lock-in
- **DX Trumps Flexibility**: Opinionated defaults with opt-out, not opt-in

### Architectural Patterns Identified
1. **Factory Pattern**: All creation functions (`createStrapiSDK`, `createStrapiRevalidator`)
2. **Adapter Pattern**: Future-proof for Strapi v5+ via `IStrapiAdapter` interface
3. **Wrapper Pattern**: Transparent cache tagging via fetch wrapper
4. **Error Boundary Pattern**: Automatic resilience for dynamic components
5. **Escape Hatch Pattern**: Always provide `rawQuery()` for advanced use cases

## Blockers
None. All project design information captured in Memory Bank. Ready to begin implementation.

---
*Last Updated: 2025-11-04 15:15 UTC+03:00*
