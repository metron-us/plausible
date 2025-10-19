/**
 * Mock utilities for testing HTTP requests to the Plausible API.
 */

import type { QueryResponse } from "../src/types.ts";

/**
 * Mock fetch response builder for testing.
 */
export class MockResponse {
  private statusCode = 200;
  private body: unknown = {};
  private headers = new Headers({ "content-type": "application/json" });

  status(code: number): MockResponse {
    this.statusCode = code;
    return this;
  }

  json(data: unknown): MockResponse {
    this.body = data;
    return this;
  }

  build(): Response {
    return new Response(JSON.stringify(this.body), {
      status: this.statusCode,
      headers: this.headers,
    });
  }
}

/**
 * Create a successful query response mock.
 */
export function createSuccessResponse(
  results: Array<Record<string, string | number | boolean | null>>,
): QueryResponse {
  return {
    results,
  };
}

/**
 * Create an error response mock.
 */
export function createErrorResponse(errorMessage: string): Response {
  return new MockResponse()
    .status(400)
    .json({ error: errorMessage })
    .build();
}

/**
 * Mock fetch function for testing.
 */
export function createMockFetch(
  response: Response,
): (input: RequestInfo | URL, init?: RequestInit) => Promise<Response> {
  return (_input: RequestInfo | URL, _init?: RequestInit) => {
    return Promise.resolve(response);
  };
}

/**
 * Mock fetch function that captures the request.
 */
export function createCapturingMockFetch(
  response: Response,
): {
  fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  getCapturedRequest: () => { url: string; init: RequestInit | undefined } | null;
} {
  let capturedUrl: string | null = null;
  let capturedInit: RequestInit | undefined;

  return {
    fetch: (input: RequestInfo | URL, init?: RequestInit) => {
      capturedUrl = input.toString();
      capturedInit = init;
      return Promise.resolve(response);
    },
    getCapturedRequest: () => {
      if (!capturedUrl) return null;
      return { url: capturedUrl, init: capturedInit };
    },
  };
}

/**
 * Sample response data for tests.
 */
export const MOCK_RESPONSES = {
  basicMetrics: createSuccessResponse([
    { visitors: 1234, pageviews: 5678 },
  ]),
  withDimensions: createSuccessResponse([
    { "event:page": "/home", visitors: 500, pageviews: 800 },
    { "event:page": "/about", visitors: 300, pageviews: 450 },
    { "event:page": "/contact", visitors: 200, pageviews: 250 },
  ]),
  withPercentage: createSuccessResponse([
    { "visit:country": "US", visitors: 500, percentage: 50.0 },
    { "visit:country": "UK", visitors: 300, percentage: 30.0 },
    { "visit:country": "CA", visitors: 200, percentage: 20.0 },
  ]),
  empty: createSuccessResponse([]),
};
