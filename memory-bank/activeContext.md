# Active Context

## Current Focus
Phase 1 complete and verified! Build system working correctly. All placeholder functions compile successfully. Ready to begin Phase 2 (Data Layer SDK implementation).

## Next Steps
1. ✅ Memory Bank populated with complete project design
2. ✅ Phase 1: Project Setup complete
3. ✅ Build system verified (CJS + ESM outputs working)
4. Begin Phase 2: Data Layer (SDK) implementation
4. Implement Data Layer (SDK):
   - Create `createStrapiSDK()` factory function
   - Implement automatic cache tagging wrapper
   - Build GraphQL client integration
5. Implement Presentation Layer (Renderer):
   - Create `<StrapiRenderer />` component
   - Implement Error Boundary wrapper
   - Add Zod validation logic
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
- **Applied To**: All Phase 2-4 placeholder functions

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
