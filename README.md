# @metron/plausible

TypeScript client library for the [Plausible Analytics Stats API](https://plausible.io/docs/stats-api).

## Features

- 🦕 Built with Deno, compatible with Node.js
- 📘 Full TypeScript support with strict type checking
- 🎯 Complete Stats API v2 coverage
- 🔍 Advanced filtering with logical operators
- 📊 Support for dimensions and grouping
- 🧪 Comprehensive test coverage (36 tests)
- 📦 Published to JSR and NPM

## Installation

### Deno

```typescript
import { PlausibleClient } from "jsr:@metron/plausible";
```

### Node.js / NPM

```bash
npm install @metron/plausible
```

```typescript
import { PlausibleClient } from "@metron/plausible";
```

## Usage

### Basic Query

```typescript
import { PlausibleClient } from "@metron/plausible";

// Create a client instance
const client = new PlausibleClient({
  apiKey: "your-api-key-here",
});

// Query your site stats
const results = await client.query({
  site_id: "example.com",
  date_range: "7d",
  metrics: ["visitors", "pageviews", "bounce_rate"],
});

console.log(results);
```

### Query with Dimensions

```typescript
// Group results by page
const pageStats = await client.query({
  site_id: "example.com",
  date_range: "30d",
  metrics: ["visitors", "pageviews"],
  dimensions: ["event:page"],
  order_by: ["visitors", "desc"],
  limit: 10,
});
```

### Advanced Filtering

```typescript
import type { Filter } from "@metron/plausible";

// Simple filter
const usVisitors = await client.query({
  site_id: "example.com",
  date_range: "7d",
  metrics: ["visitors"],
  filters: [["is", "visit:country", ["US"]]],
});

// Complex filter with logical operators
const complexFilter: Filter = [
  "and",
  [
    ["is", "visit:country", ["US", "CA", "GB"]],
    [
      "or",
      [
        ["contains", "event:page", ["/products"]],
        ["contains", "event:page", ["/pricing"]],
      ],
    ],
    ["is_not", "visit:device", ["Mobile"]],
  ],
];

const filteredResults = await client.query({
  site_id: "example.com",
  date_range: "30d",
  metrics: ["visitors", "conversion_rate"],
  filters: [complexFilter],
});
```

### Pagination

```typescript
// Fetch results with pagination
const paginatedResults = await client.query({
  site_id: "example.com",
  date_range: "7d",
  metrics: ["visitors"],
  dimensions: ["event:page"],
  limit: 100,
  offset: 200,
});
```

## API

### `PlausibleClient`

#### Constructor

```typescript
new PlausibleClient(config: PlausibleConfig)
```

**Options:**

- `apiKey` (required): Your Plausible API key
- `baseUrl` (optional): Custom Plausible instance URL (defaults to `https://plausible.io`)

#### Methods

##### `query(params: QueryParams): Promise<QueryResponse>`

Execute a query against the Stats API.

**Parameters:**

- `site_id`: The domain to query (e.g., `"example.com"`)
- `date_range`: Time period (e.g., `"7d"`, `"30d"`, `"month"`, or custom `["2024-01-01", "2024-01-31"]`)
- `metrics`: Array of metrics to retrieve
- `dimensions` (optional): Dimensions for grouping results
- `filters` (optional): Advanced filter criteria using the filter DSL
- `order_by` (optional): Sort results by metric or dimension `[field, direction]`
- `limit` (optional): Maximum number of results
- `offset` (optional): Pagination offset
- `include_imported` (optional): Include Google Analytics imported data

**Supported Metrics:**

_Core Metrics:_

- `visitors`: Unique visitors
- `visits`: Total visits
- `pageviews`: Total page views
- `views_per_visit`: Average views per visit
- `bounce_rate`: Percentage of single-page visits
- `visit_duration`: Average visit duration in seconds
- `events`: Total events (pageviews + custom events)

_Specialized Metrics:_

- `scroll_depth`: Average scroll depth (requires `event:page` dimension/filter)
- `percentage`: Percentage of total
- `conversion_rate`: Goal conversion rate
- `group_conversion_rate`: Per-dimension conversion rate
- `time_on_page`: Average time on page

_Revenue Metrics:_

- `average_revenue`: Average revenue per conversion
- `total_revenue`: Total revenue from conversions

**Supported Dimensions:**

_Event Dimensions:_

- `event:goal`, `event:page`, `event:hostname`
- `event:props:{custom_prop_name}`: Custom event properties

_Visit Dimensions:_

- `visit:entry_page`, `visit:exit_page`
- `visit:source`, `visit:referrer`, `visit:channel`
- `visit:utm_medium`, `visit:utm_source`, `visit:utm_campaign`, `visit:utm_content`, `visit:utm_term`

_Device/Browser Dimensions:_

- `visit:device`, `visit:browser`, `visit:browser_version`
- `visit:os`, `visit:os_version`

_Location Dimensions:_

- `visit:country`, `visit:region`, `visit:city`

**Filter Operators:**

_Simple Operators:_

- `is`, `is_not`: Exact match
- `contains`, `contains_not`: Partial string match
- `matches`, `matches_not`: Regex pattern match

_Logical Operators:_

- `and`: All conditions must be true
- `or`: Any condition must be true
- `not`: Inverts the condition

## Development

### Prerequisites

- [Deno](https://deno.land/) 1.40 or later

### Commands

```bash
# Run tests
deno task test

# Run tests in watch mode
deno task test:watch

# Type check
deno task check

# Lint
deno task lint

# Format
deno task fmt
```

## License

MIT
