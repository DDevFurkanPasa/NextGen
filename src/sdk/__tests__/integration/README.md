# Integration Tests

Integration tests verify the SDK's ability to communicate with a real Strapi instance.

## Prerequisites

### 1. Running Strapi Instance

You need a Strapi v4 instance with:
- GraphQL plugin enabled
- Sample content types created
- Test data populated

### 2. Environment Variables

Set the following environment variables:

```bash
# Required
TEST_STRAPI_URL=http://localhost:1337/graphql

# Optional (for authenticated requests)
TEST_STRAPI_TOKEN=your_api_token_here
```

## Quick Setup

### Option 1: Use Docker (Recommended)

```bash
# Start Strapi with Docker
docker run -d \
  --name strapi-test \
  -p 1337:1337 \
  -e DATABASE_CLIENT=sqlite \
  -e DATABASE_FILENAME=.tmp/data.db \
  strapi/strapi:latest
```

### Option 2: Local Strapi Instance

```bash
# Create a new Strapi project
npx create-strapi-app@latest test-strapi --quickstart

# Install GraphQL plugin
cd test-strapi
npm install @strapi/plugin-graphql

# Start Strapi
npm run develop
```

## Test Data Setup

Create the following content types in Strapi:

### Page Content Type

```json
{
  "singularName": "page",
  "pluralName": "pages",
  "attributes": {
    "slug": {
      "type": "string",
      "required": true,
      "unique": true
    },
    "title": {
      "type": "string",
      "required": true
    },
    "content": {
      "type": "richtext"
    }
  }
}
```

**Test Data**: Create a page with slug `home`

### Collection Content Type (Optional)

```json
{
  "singularName": "blog-post",
  "pluralName": "blog-posts",
  "attributes": {
    "title": {
      "type": "string",
      "required": true
    },
    "slug": {
      "type": "string",
      "required": true,
      "unique": true
    },
    "content": {
      "type": "richtext"
    }
  }
}
```

### Global Content Type (Optional)

```json
{
  "singularName": "global",
  "pluralName": "globals",
  "attributes": {
    "siteName": {
      "type": "string"
    },
    "description": {
      "type": "text"
    }
  }
}
```

## Running Integration Tests

### Run All Tests (Including Integration)

```bash
# Set environment variables and run tests
TEST_STRAPI_URL=http://localhost:1337/graphql npm test
```

### Run Only Integration Tests

```bash
# Using Vitest filter
TEST_STRAPI_URL=http://localhost:1337/graphql npm test -- integration
```

### Run with Authentication

```bash
# Get API token from Strapi admin panel
# Settings → API Tokens → Create new token

TEST_STRAPI_URL=http://localhost:1337/graphql \
TEST_STRAPI_TOKEN=your_token_here \
npm test
```

## Test Coverage

Integration tests verify:

### ✅ Connection & Authentication
- GraphQL endpoint connectivity
- Token-based authentication
- Error handling for connection issues

### ✅ Query Methods
- `getPage()` - Fetch single pages by slug
- `getCollection()` - Fetch collections with filters
- `getGlobal()` - Fetch global singletons
- `rawQuery()` - Custom GraphQL queries

### ✅ Features
- Pagination (limit, offset)
- Filtering (eq, ne, contains, etc.)
- Sorting
- Locale/i18n support
- Draft mode detection

### ✅ Error Handling
- Network errors
- Malformed queries
- Missing variables
- Non-existent resources
- Authentication failures

### ✅ Performance
- Query execution time
- Concurrent requests
- Response structure validation

## Troubleshooting

### Tests are Skipped

**Problem**: Integration tests show as skipped

**Solution**: Ensure `TEST_STRAPI_URL` environment variable is set

```bash
# Check if variable is set
echo $TEST_STRAPI_URL

# Set it if missing
export TEST_STRAPI_URL=http://localhost:1337/graphql
```

### Connection Refused

**Problem**: `ECONNREFUSED` error

**Solution**: Ensure Strapi is running on the specified URL

```bash
# Check if Strapi is running
curl http://localhost:1337/graphql

# Start Strapi if not running
cd your-strapi-project
npm run develop
```

### GraphQL Plugin Not Found

**Problem**: GraphQL endpoint returns 404

**Solution**: Install and enable GraphQL plugin

```bash
cd your-strapi-project
npm install @strapi/plugin-graphql
# Restart Strapi
```

### Authentication Errors

**Problem**: 401 Unauthorized errors

**Solution**: 
1. Create an API token in Strapi admin
2. Set `TEST_STRAPI_TOKEN` environment variable
3. Ensure token has correct permissions

### No Test Data

**Problem**: Tests fail because content doesn't exist

**Solution**: Create test data in Strapi admin:
1. Create a Page with slug `home`
2. Publish the page
3. Re-run tests

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Integration Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      strapi:
        image: strapi/strapi:latest
        ports:
          - 1337:1337
        env:
          DATABASE_CLIENT: sqlite
          DATABASE_FILENAME: .tmp/data.db
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Wait for Strapi
        run: |
          timeout 60 bash -c 'until curl -f http://localhost:1337; do sleep 2; done'
      
      - name: Run integration tests
        env:
          TEST_STRAPI_URL: http://localhost:1337/graphql
        run: npm test
```

## Best Practices

1. **Use Test Database**: Never run integration tests against production
2. **Clean Up**: Reset test data between test runs
3. **Isolation**: Each test should be independent
4. **Timeouts**: Set reasonable timeouts for network requests
5. **Skip Gracefully**: Tests should skip if Strapi is unavailable
6. **Document Requirements**: Clearly document required test data

## Next Steps

After setting up integration tests:
1. Add more content types for comprehensive testing
2. Test complex queries with relations
3. Test file uploads and media
4. Test webhooks and revalidation
5. Add performance benchmarks

---

**Need Help?** Open an issue on [GitHub](https://github.com/DDevFurkanPasa/NextGen/issues)
