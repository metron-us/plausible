import type { PlausibleConfig, PlausibleError, QueryParams, QueryResponse } from "./types.ts";
import { PlausibleApiError } from "./types.ts";

/**
 * Client for interacting with the Plausible Stats API.
 */
export class PlausibleClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly rateLimit = 600; // requests per hour

  constructor(config: PlausibleConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl ?? "https://plausible.io";
  }

  /**
   * Execute a query against the Stats API.
   *
   * @param params - Query parameters
   * @returns Query results
   * @throws Error if the API returns an error response
   */
  async query(params: QueryParams): Promise<QueryResponse> {
    const url = `${this.baseUrl}/api/v2/query`;

    const body: Record<string, unknown> = {
      site_id: params.site_id,
      date_range: params.date_range,
      metrics: params.metrics,
    };

    if (params.dimensions && params.dimensions.length > 0) {
      body.dimensions = params.dimensions;
    }

    if (params.filters && params.filters.length > 0) {
      body.filters = params.filters;
    }

    if (params.order_by) {
      body.order_by = params.order_by;
    }

    if (params.limit !== undefined) {
      body.limit = params.limit;
    }

    if (params.offset !== undefined) {
      body.offset = params.offset;
    }

    if (params.include_imported !== undefined) {
      body.include_imported = params.include_imported;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json() as PlausibleError;
      throw new PlausibleApiError(
        error.error,
        response.status,
        error,
      );
    }

    return await response.json() as QueryResponse;
  }
}
