import { assertEquals, assertRejects } from "@std/assert";
import { PlausibleClient } from "../src/client.ts";
import type { Filter, QueryParams } from "../src/types.ts";
import {
  createCapturingMockFetch,
  createErrorResponse,
  createMockFetch,
  MOCK_RESPONSES,
  MockResponse,
} from "./mocks.ts";

Deno.test("PlausibleClient - constructor", () => {
  const client = new PlausibleClient({
    apiKey: "test-api-key",
  });

  assertEquals(typeof client, "object");
});

Deno.test("PlausibleClient - constructor with custom baseUrl", () => {
  const client = new PlausibleClient({
    apiKey: "test-api-key",
    baseUrl: "https://custom.plausible.io",
  });

  assertEquals(typeof client, "object");
});

Deno.test("PlausibleClient - query method exists", () => {
  const client = new PlausibleClient({
    apiKey: "test-api-key",
  });

  assertEquals(typeof client.query, "function");
});

Deno.test("PlausibleClient - basic query with mocked response", async () => {
  const mockResponse = new MockResponse()
    .status(200)
    .json(MOCK_RESPONSES.basicMetrics)
    .build();

  const originalFetch = globalThis.fetch;
  globalThis.fetch = createMockFetch(mockResponse);

  try {
    const client = new PlausibleClient({ apiKey: "test-key" });

    const result = await client.query({
      site_id: "example.com",
      date_range: "7d",
      metrics: ["visitors", "pageviews"],
    });

    assertEquals(result.results.length, 1);
    assertEquals(result.results[0]?.visitors, 1234);
    assertEquals(result.results[0]?.pageviews, 5678);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test("PlausibleClient - query with dimensions", async () => {
  const mockResponse = new MockResponse()
    .status(200)
    .json(MOCK_RESPONSES.withDimensions)
    .build();

  const originalFetch = globalThis.fetch;
  globalThis.fetch = createMockFetch(mockResponse);

  try {
    const client = new PlausibleClient({ apiKey: "test-key" });

    const result = await client.query({
      site_id: "example.com",
      date_range: "7d",
      metrics: ["visitors", "pageviews"],
      dimensions: ["event:page"],
    });

    assertEquals(result.results.length, 3);
    assertEquals(result.results[0]?.["event:page"], "/home");
    assertEquals(result.results[0]?.visitors, 500);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test("PlausibleClient - query with filters", async () => {
  const mockFetch = createCapturingMockFetch(
    new MockResponse()
      .status(200)
      .json(MOCK_RESPONSES.basicMetrics)
      .build(),
  );

  const originalFetch = globalThis.fetch;
  globalThis.fetch = mockFetch.fetch;

  try {
    const client = new PlausibleClient({ apiKey: "test-key" });

    await client.query({
      site_id: "example.com",
      date_range: "7d",
      metrics: ["visitors"],
      filters: [["is", "event:page", ["/home"]]],
    });

    const captured = mockFetch.getCapturedRequest();
    assertEquals(captured !== null, true);

    if (captured?.init?.body) {
      const body = JSON.parse(captured.init.body as string);
      assertEquals(body.filters, [["is", "event:page", ["/home"]]]);
    }
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test("PlausibleClient - query with complex filters", async () => {
  const mockFetch = createCapturingMockFetch(
    new MockResponse()
      .status(200)
      .json(MOCK_RESPONSES.withDimensions)
      .build(),
  );

  const originalFetch = globalThis.fetch;
  globalThis.fetch = mockFetch.fetch;

  try {
    const client = new PlausibleClient({ apiKey: "test-key" });

    const complexFilter: Filter = [
      "and",
      [
        ["is", "visit:country", ["US"]],
        ["contains", "event:page", ["/blog"]],
      ],
    ];

    await client.query({
      site_id: "example.com",
      date_range: "30d",
      metrics: ["visitors", "pageviews"],
      filters: [complexFilter],
    });

    const captured = mockFetch.getCapturedRequest();
    if (captured?.init?.body) {
      const body = JSON.parse(captured.init.body as string);
      assertEquals(body.filters[0][0], "and");
      assertEquals(Array.isArray(body.filters[0][1]), true);
    }
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test("PlausibleClient - query with pagination", async () => {
  const mockFetch = createCapturingMockFetch(
    new MockResponse()
      .status(200)
      .json(MOCK_RESPONSES.withDimensions)
      .build(),
  );

  const originalFetch = globalThis.fetch;
  globalThis.fetch = mockFetch.fetch;

  try {
    const client = new PlausibleClient({ apiKey: "test-key" });

    await client.query({
      site_id: "example.com",
      date_range: "7d",
      metrics: ["visitors"],
      dimensions: ["event:page"],
      limit: 10,
      offset: 20,
    });

    const captured = mockFetch.getCapturedRequest();
    if (captured?.init?.body) {
      const body = JSON.parse(captured.init.body as string);
      assertEquals(body.limit, 10);
      assertEquals(body.offset, 20);
    }
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test("PlausibleClient - query with order_by", async () => {
  const mockFetch = createCapturingMockFetch(
    new MockResponse()
      .status(200)
      .json(MOCK_RESPONSES.withDimensions)
      .build(),
  );

  const originalFetch = globalThis.fetch;
  globalThis.fetch = mockFetch.fetch;

  try {
    const client = new PlausibleClient({ apiKey: "test-key" });

    await client.query({
      site_id: "example.com",
      date_range: "7d",
      metrics: ["visitors", "pageviews"],
      dimensions: ["event:page"],
      order_by: ["visitors", "desc"],
    });

    const captured = mockFetch.getCapturedRequest();
    if (captured?.init?.body) {
      const body = JSON.parse(captured.init.body as string);
      assertEquals(body.order_by, ["visitors", "desc"]);
    }
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test("PlausibleClient - sends correct authorization header", async () => {
  const mockFetch = createCapturingMockFetch(
    new MockResponse()
      .status(200)
      .json(MOCK_RESPONSES.basicMetrics)
      .build(),
  );

  const originalFetch = globalThis.fetch;
  globalThis.fetch = mockFetch.fetch;

  try {
    const client = new PlausibleClient({ apiKey: "my-secret-key" });

    await client.query({
      site_id: "example.com",
      date_range: "7d",
      metrics: ["visitors"],
    });

    const captured = mockFetch.getCapturedRequest();
    const authHeader = captured?.init?.headers &&
      (captured.init.headers as Record<string, string>)["Authorization"];

    assertEquals(authHeader, "Bearer my-secret-key");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test("PlausibleClient - uses custom baseUrl", async () => {
  const mockFetch = createCapturingMockFetch(
    new MockResponse()
      .status(200)
      .json(MOCK_RESPONSES.basicMetrics)
      .build(),
  );

  const originalFetch = globalThis.fetch;
  globalThis.fetch = mockFetch.fetch;

  try {
    const client = new PlausibleClient({
      apiKey: "test-key",
      baseUrl: "https://custom.plausible.io",
    });

    await client.query({
      site_id: "example.com",
      date_range: "7d",
      metrics: ["visitors"],
    });

    const captured = mockFetch.getCapturedRequest();
    assertEquals(
      captured?.url,
      "https://custom.plausible.io/api/v2/query",
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test("PlausibleClient - handles API errors", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = createMockFetch(
    createErrorResponse("Invalid API key"),
  );

  try {
    const client = new PlausibleClient({ apiKey: "invalid-key" });

    await assertRejects(
      async () => {
        await client.query({
          site_id: "example.com",
          date_range: "7d",
          metrics: ["visitors"],
        });
      },
      Error,
      "Plausible API error: Invalid API key",
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test("PlausibleClient - handles validation errors", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = createMockFetch(
    createErrorResponse("Site not found"),
  );

  try {
    const client = new PlausibleClient({ apiKey: "test-key" });

    await assertRejects(
      async () => {
        await client.query({
          site_id: "nonexistent.com",
          date_range: "7d",
          metrics: ["visitors"],
        });
      },
      Error,
      "Plausible API error: Site not found",
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test("PlausibleClient - handles network errors", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = () => {
    throw new TypeError("Network error");
  };

  try {
    const client = new PlausibleClient({ apiKey: "test-key" });

    await assertRejects(
      async () => {
        await client.query({
          site_id: "example.com",
          date_range: "7d",
          metrics: ["visitors"],
        });
      },
      TypeError,
      "Network error",
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test("PlausibleClient - handles empty results", async () => {
  const mockResponse = new MockResponse()
    .status(200)
    .json(MOCK_RESPONSES.empty)
    .build();

  const originalFetch = globalThis.fetch;
  globalThis.fetch = createMockFetch(mockResponse);

  try {
    const client = new PlausibleClient({ apiKey: "test-key" });

    const result = await client.query({
      site_id: "example.com",
      date_range: "7d",
      metrics: ["visitors"],
    });

    assertEquals(result.results.length, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

// Integration test - requires valid API key and site
// Skipped by default, can be enabled with PLAUSIBLE_API_KEY env var
Deno.test({
  name: "PlausibleClient - query integration test",
  ignore: !Deno.env.get("PLAUSIBLE_API_KEY"),
  async fn() {
    const apiKey = Deno.env.get("PLAUSIBLE_API_KEY");
    const siteId = Deno.env.get("PLAUSIBLE_SITE_ID");

    if (!apiKey || !siteId) {
      throw new Error("PLAUSIBLE_API_KEY and PLAUSIBLE_SITE_ID must be set");
    }

    const client = new PlausibleClient({ apiKey });

    const params: QueryParams = {
      site_id: siteId,
      date_range: "7d",
      metrics: ["visitors", "pageviews"],
    };

    const result = await client.query(params);

    assertEquals(typeof result, "object");
    assertEquals(Array.isArray(result.results), true);
  },
});
