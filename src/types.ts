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
 *
 * @example
 * ```ts
 * // Relative date ranges
 * const last7Days: DateRange = "7d";
 * const last30Days: DateRange = "30d";
 * const thisMonth: DateRange = "month";
 *
 * // Custom date range with ISO8601 dates
 * const customRange: DateRange = ["2024-01-01", "2024-01-31"];
 * ```
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
 *
 * @example
 * ```ts
 * // Filter for US visitors only
 * const filter: SimpleFilter = ["is", "visit:country", ["US"]];
 *
 * // Filter for pages containing "/blog"
 * const blogFilter: SimpleFilter = ["contains", "event:page", ["/blog"]];
 *
 * // Exclude mobile devices
 * const noMobile: SimpleFilter = ["is_not", "visit:device", ["Mobile"]];
 * ```
 */
export type SimpleFilter = [FilterOperator, string, string[]];

/**
 * Logical filter clause: [logical_operator, filters]
 *
 * @example
 * ```ts
 * // Combine multiple conditions with AND
 * const andFilter: LogicalFilter = [
 *   "and",
 *   [
 *     ["is", "visit:country", ["US", "CA"]],
 *     ["contains", "event:page", ["/products"]],
 *   ],
 * ];
 *
 * // Use OR to match any condition
 * const orFilter: LogicalFilter = [
 *   "or",
 *   [
 *     ["is", "visit:source", ["twitter"]],
 *     ["is", "visit:source", ["facebook"]],
 *   ],
 * ];
 *
 * // Negate a condition with NOT
 * const notFilter: LogicalFilter = [
 *   "not",
 *   [["is", "visit:device", ["Mobile"]]],
 * ];
 * ```
 */
export type LogicalFilter = [LogicalOperator, Filter[]];

/**
 * Any filter type (simple or logical).
 *
 * @example
 * ```ts
 * // Nested logical filters for complex queries
 * const complexFilter: Filter = [
 *   "and",
 *   [
 *     ["is", "visit:country", ["US"]],
 *     [
 *       "or",
 *       [
 *         ["contains", "event:page", ["/pricing"]],
 *         ["contains", "event:page", ["/products"]],
 *       ],
 *     ],
 *     ["is_not", "visit:device", ["Mobile"]],
 *   ],
 * ];
 * ```
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
 * Metadata returned with query responses.
 */
export interface QueryResponseMeta {
  /** Warning message if applicable (e.g., metric/dimension compatibility issues) */
  warning?: string;
}

/**
 * Response from the Stats API.
 *
 * @example
 * ```ts
 * const response: QueryResponse = {
 *   results: [
 *     { visitors: 1234, pageviews: 5678 }
 *   ],
 *   meta: {
 *     warning: "Some metrics may not be available for this query"
 *   }
 * };
 * ```
 */
export interface QueryResponse {
  /** Query results */
  results: QueryResult[];
  /** Query metadata */
  meta?: QueryResponseMeta;
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

/**
 * Custom error class for Plausible API errors.
 * Provides additional context beyond standard Error objects.
 *
 * @example
 * ```ts
 * try {
 *   await client.query(params);
 * } catch (error) {
 *   if (error instanceof PlausibleApiError) {
 *     console.error(`API Error (${error.statusCode}): ${error.message}`);
 *     // Handle specific status codes
 *     if (error.statusCode === 429) {
 *       // Rate limit exceeded
 *     }
 *   }
 * }
 * ```
 */
export class PlausibleApiError extends Error {
  /**
   * @param message - Human-readable error message
   * @param statusCode - HTTP status code from the API response
   * @param response - Raw response data from the API
   */
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly response?: unknown,
  ) {
    super(message);
    this.name = "PlausibleApiError";
  }
}
