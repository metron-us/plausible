/**
 * Plausible Stats API client library.
 *
 * @module
 *
 * @example
 * ```ts
 * import { PlausibleClient } from "@metron/plausible";
 *
 * const client = new PlausibleClient({
 *   apiKey: "your-api-key",
 * });
 *
 * const results = await client.query({
 *   site_id: "example.com",
 *   date_range: "7d",
 *   metrics: ["visitors", "pageviews"],
 * });
 * ```
 */

export { PlausibleClient } from "./client.ts";
export { PlausibleApiError } from "./types.ts";
export type {
  DateRange,
  Dimension,
  Filter,
  FilterOperator,
  LogicalFilter,
  LogicalOperator,
  Metric,
  OrderDirection,
  PlausibleConfig,
  PlausibleError,
  QueryParams,
  QueryResponse,
  QueryResponseMeta,
  QueryResult,
  SimpleFilter,
} from "./types.ts";
