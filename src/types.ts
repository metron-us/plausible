/**
 * Core types for the Plausible Stats API client.
 * Based on Plausible Stats API v2 documentation.
 */

/**
 * Configuration options for the Plausible client.
 */
export interface PlausibleConfig {
  /** API key for authentication */
  apiKey: string;
  /** Base URL for the Plausible API (defaults to https://plausible.io) */
  baseUrl?: string;
}

/**
 * Date range for queries.
 * Supports relative ranges (e.g., "7d", "30d", "month") or custom ISO8601 dates.
 */
export type DateRange = string | [string, string];

/**
 * Available metrics in the Plausible Stats API.
 */
export type Metric =
  // Core metrics
  | "visitors"
  | "visits"
  | "pageviews"
  | "views_per_visit"
  | "bounce_rate"
  | "visit_duration"
  | "events"
  // Specialized metrics
  | "scroll_depth"
  | "percentage"
  | "conversion_rate"
  | "group_conversion_rate"
  | "time_on_page"
  // Revenue metrics
  | "average_revenue"
  | "total_revenue";

/**
 * Dimension types for grouping results.
 */
export type Dimension =
  // Event dimensions
  | "event:goal"
  | "event:page"
  | "event:hostname"
  | `event:props:${string}`
  // Visit dimensions
  | "visit:entry_page"
  | "visit:exit_page"
  | "visit:source"
  | "visit:referrer"
  | "visit:channel"
  | "visit:utm_medium"
  | "visit:utm_source"
  | "visit:utm_campaign"
  | "visit:utm_content"
  | "visit:utm_term"
  // Device/Browser dimensions
  | "visit:device"
  | "visit:browser"
  | "visit:browser_version"
  | "visit:os"
  | "visit:os_version"
  // Location dimensions
  | "visit:country"
  | "visit:region"
  | "visit:city";

/**
 * Filter operator types.
 */
export type FilterOperator =
  | "is"
  | "is_not"
  | "contains"
  | "contains_not"
  | "matches"
  | "matches_not";

/**
 * Logical operator types.
 */
export type LogicalOperator = "and" | "or" | "not";

/**
 * Simple filter clause: [operator, dimension, values]
 */
export type SimpleFilter = [FilterOperator, string, string[]];

/**
 * Logical filter clause: [logical_operator, filters]
 */
export type LogicalFilter = [LogicalOperator, Filter[]];

/**
 * Any filter type (simple or logical).
 */
export type Filter = SimpleFilter | LogicalFilter;

/**
 * Order direction for sorting results.
 */
export type OrderDirection = "asc" | "desc";

/**
 * Query parameters for the Stats API.
 */
export interface QueryParams {
  /** The site domain to query */
  site_id: string;
  /** Date range for the query */
  date_range: DateRange;
  /** Metrics to retrieve */
  metrics: Metric[];
  /** Optional dimensions for grouping results */
  dimensions?: Dimension[];
  /** Optional filters using the filter DSL */
  filters?: Filter[];
  /** Optional order by metric or dimension */
  order_by?: [string, OrderDirection];
  /** Optional pagination limit */
  limit?: number;
  /** Optional pagination offset */
  offset?: number;
  /** Include imported data from Google Analytics */
  include_imported?: boolean;
}

/**
 * Response from the Stats API.
 */
export interface QueryResponse {
  /** Query results */
  results: QueryResult[];
  /** Query metadata */
  meta?: {
    /** Warning messages if any */
    warning?: string;
  };
}

/**
 * Individual result row from a query.
 */
export interface QueryResult {
  /** Metric values for this result */
  [key: string]: string | number | boolean | null | undefined;
}

/**
 * Error response from the Plausible API.
 */
export interface PlausibleError {
  /** Error message */
  error: string;
}
