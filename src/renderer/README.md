# Presentation Layer (Renderer) - Phase 3

## Overview

The StrapiRenderer component provides automatic rendering of Strapi dynamic zones with built-in Error Boundaries, Zod validation, and graceful error handling.

## Features

### ✅ Implemented

- **Automatic Component Mapping**: Maps Strapi `__component` types to React components
- **Error Boundaries**: Each component wrapped in individual Error Boundary for isolation
- **Zod Validation**: Optional runtime validation with 3 modes: 'error', 'warn', 'silent'
- **Development Mode Error UI**: Detailed error messages with stack traces
- **Production Mode Graceful Degradation**: Silent failures or fallback UI
- **Type-Safe**: Full TypeScript support with proper type guards

## Usage Example

```tsx
import { StrapiRenderer } from 'strapi-nextgen-framework';
import { z } from 'zod';

// Define your component map
const componentMap = {
  'sections.hero': {
    component: HeroSection,
    schema: z.object({
      __component: z.literal('sections.hero'),
      title: z.string(),
      subtitle: z.string().optional(),
      image: z.object({
        url: z.string(),
        alternativeText: z.string().optional(),
      }),
    }),
  },
  'sections.features': {
    component: FeaturesSection,
    schema: z.object({
      __component: z.literal('sections.features'),
      features: z.array(
        z.object({
          title: z.string(),
          description: z.string(),
          icon: z.string(),
        })
      ),
    }),
  },
};

// In your page component
export default function Page({ dynamicZone }) {
  return (
    <StrapiRenderer
      data={dynamicZone}
      map={componentMap}
      validation="warn" // 'error' | 'warn' | 'silent'
      fallback={<div>Something went wrong</div>}
      onError={(error, errorInfo, componentType) => {
        // Optional: Send to error tracking service
        console.error('Component error:', componentType, error);
      }}
    />
  );
}
```

## Validation Modes

### 'error' (Default in Development)
- Validates all component data with Zod schemas
- Logs detailed error messages to console
- Skips rendering components that fail validation
- Best for catching issues during development

### 'warn' (Recommended for Staging)
- Validates all component data with Zod schemas
- Logs warnings to console but still renders components
- Useful for identifying data issues without breaking the page

### 'silent' (Default in Production)
- Skips Zod validation entirely
- No performance overhead
- Relies on Error Boundaries to catch runtime errors

## Error Handling

### Development Mode
Shows detailed error UI with:
- Component type that failed
- Error message
- Full stack trace (expandable)
- Red border styling for visibility

### Production Mode
- Hides error details from users
- Shows fallback UI if provided
- Logs minimal error info to console
- Calls onError callback if provided

## Component Map Structure

```typescript
type ComponentMap = Record<string, {
  component: React.ComponentType<unknown>;
  schema?: ZodSchema; // Optional Zod schema for validation
}>;
```

## Error Boundary Features

- **Isolation**: Each component has its own Error Boundary
- **Cascading Prevention**: One broken component doesn't crash the page
- **Custom Fallback**: Optional fallback UI per renderer instance
- **Error Callback**: Hook into errors for logging/tracking

## Architecture

```
StrapiRenderer
    ↓
Loop through data array
    ↓
For each component:
    1. Type guard: ensure object with __component
    2. Look up in component map
    3. Validate with Zod (if schema provided)
    4. Wrap in Error Boundary
    5. Render component
```

## Files

- **`index.tsx`** (124 lines): Main StrapiRenderer component
- **`error-boundary.tsx`** (119 lines): ComponentErrorBoundary class component
- **`validator.ts`** (59 lines): Zod validation utilities
- **`types.ts`** (39 lines): TypeScript type definitions

## Best Practices

1. **Always provide schemas in development** - Catch data issues early
2. **Use 'warn' mode in staging** - Identify issues without breaking pages
3. **Use 'silent' mode in production** - Optimize performance
4. **Provide fallback UI** - Better UX when components fail
5. **Use onError callback** - Send errors to tracking service (Sentry, etc.)

## Next Steps

Developers should:
1. Create component map for their Strapi dynamic zones
2. Define Zod schemas for each component type
3. Implement React components that match Strapi data structure
4. Use TypeScript for full type safety
