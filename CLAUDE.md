# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`@metron/plausible` is a TypeScript client library for the Plausible Analytics Stats API v2, built with Deno and published to both JSR and NPM. The library provides full type safety for querying analytics data with support for complex filtering, dimensions, and metrics.

## Development Commands

### Testing

```bash
deno task test              # Run all tests (requires --allow-net --allow-env)
deno task test:watch        # Run tests in watch mode
```

To run a single test file:

```bash
deno test tests/client.test.ts --allow-net --allow-env
deno test tests/filters.test.ts --allow-net --allow-env
```

### Type Checking and Code Quality

```bash
deno task check             # Type check all TypeScript files
deno task lint              # Lint code
deno task fmt               # Format code
deno task fmt:check         # Check formatting without modifying
```

### Publishing

```bash
deno task publish:check     # Dry-run to verify package before publishing
deno publish                # Publish to JSR (see PUBLISHING.md)
```

## Architecture

### Core Module Structure

The library has a simple, focused architecture:

- **`src/types.ts`**: All TypeScript type definitions for the Plausible API
  - Query parameters, response types, metrics, dimensions
  - Filter DSL types (simple and logical filters)
  - Strict compiler options enforced: `noImplicitAny`, `strictNullChecks`, `noUncheckedIndexedAccess`

- **`src/client.ts`**: `PlausibleClient` class - the main API client
  - Single `query()` method that handles all Stats API v2 queries
  - Uses standard `fetch()` for HTTP requests
  - Constructs request bodies from typed parameters
  - Handles authentication via Bearer token

- **`src/mod.ts`**: Public API entrypoint
  - Exports `PlausibleClient` class
  - Re-exports all type definitions for consumer use

### Testing Infrastructure

Tests are located in `tests/` and use Deno's built-in test runner with `@std/assert`:

- **`tests/mocks.ts`**: Reusable mock utilities
  - `MockResponse` builder for creating fake HTTP responses
  - `createMockFetch()` for mocking the global fetch function
  - `createCapturingMockFetch()` for inspecting outgoing requests
  - `MOCK_RESPONSES` constant with common response fixtures

- **`tests/client.test.ts`**: Tests for `PlausibleClient`
  - Uses global fetch mocking pattern: save `globalThis.fetch`, replace it, restore in finally block
  - Tests both success and error response paths

- **`tests/filters.test.ts`**: Tests for filter type validation
- **`tests/types.test.ts`**: Tests for type definitions

### Filter DSL Architecture

The Plausible filter system supports two types of filters:

1. **SimpleFilter**: `[operator, dimension, [values]]`
   - Example: `["is", "visit:country", ["US", "CA"]]`

2. **LogicalFilter**: `[logical_operator, [filters...]]`
   - Example: `["and", [filter1, filter2]]`
   - Can nest arbitrarily deep

The TypeScript types in `types.ts` use discriminated unions to represent this recursive structure.

## Key Implementation Details

### Strict Type Safety

- The project uses the strictest TypeScript compiler settings
- All types must be explicitly defined (no `any`)
- All indexed access is checked (`noUncheckedIndexedAccess`)
- Test code must also follow strict typing

### API Request Construction

The `PlausibleClient.query()` method:

1. Builds a request body object from `QueryParams`
2. Only includes optional fields if they're defined
3. Makes a POST request to `/api/v2/query`
4. Handles errors by parsing the JSON error response and throwing

### Test Mocking Pattern

When writing tests that use `PlausibleClient`:

```typescript
const mockResponse = new MockResponse()
  .status(200)
  .json(yourResponseData)
  .build();

const originalFetch = globalThis.fetch;
globalThis.fetch = createMockFetch(mockResponse);

try {
  // Your test code
} finally {
  globalThis.fetch = originalFetch;
}
```

### Formatting Configuration

The project uses specific Deno formatting rules (see `deno.json`):

- 2-space indents (no tabs)
- 100 character line width
- Semicolons required
- Double quotes for strings

## OpenAPI Specification

The repository includes `openapi.yaml` - a comprehensive OpenAPI 3.1.0 specification for the Plausible Stats API. This was created because Plausible doesn't provide an official spec.

When modifying the OpenAPI spec:

```bash
npx @redocly/cli lint openapi.yaml
```

## Publishing Workflow

This package is dual-published to JSR and NPM:

1. **JSR**: Primary registry for Deno consumers
   - Update version in `deno.json`
   - Run pre-publish checks (see PUBLISHING.md)
   - `deno publish` to publish

2. **NPM**: For Node.js consumers (see `package.json`)
   - Uses `@deno/dnt` for building: `npm run build`
   - Note: The NPM package.json exists but the build process may not be fully configured

See `PUBLISHING.md` for the complete checklist and step-by-step instructions.

## Important Notes

- All API requests require `--allow-net` permission
- Tests may use `--allow-env` for environment-based configuration
- The library has zero runtime dependencies (only dev dependencies for testing)
- Self-hosted Plausible instances are supported via the `baseUrl` config option
- Rate limit is 600 requests/hour (documented in `client.ts`)
