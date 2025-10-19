import { assertEquals } from "@std/assert";
import type { DateRange, Metric, PlausibleConfig, QueryParams } from "../src/types.ts";

Deno.test("Types - PlausibleConfig accepts valid configuration", () => {
  const config: PlausibleConfig = {
    apiKey: "test-key",
  };

  assertEquals(config.apiKey, "test-key");
});

Deno.test("Types - PlausibleConfig with baseUrl", () => {
  const config: PlausibleConfig = {
    apiKey: "test-key",
    baseUrl: "https://example.com",
  };

  assertEquals(config.baseUrl, "https://example.com");
});

Deno.test("Types - DateRange accepts string", () => {
  const dateRange: DateRange = "7d";
  assertEquals(dateRange, "7d");
});

Deno.test("Types - DateRange accepts tuple", () => {
  const dateRange: DateRange = ["2024-01-01", "2024-01-31"];
  assertEquals(dateRange[0], "2024-01-01");
  assertEquals(dateRange[1], "2024-01-31");
});

Deno.test("Types - Metric accepts valid metric names", () => {
  const metrics: Metric[] = [
    "visitors",
    "visits",
    "pageviews",
    "views_per_visit",
    "bounce_rate",
    "visit_duration",
  ];

  assertEquals(metrics.length, 6);
});

Deno.test("Types - QueryParams with required fields", () => {
  const params: QueryParams = {
    site_id: "example.com",
    date_range: "7d",
    metrics: ["visitors"],
  };

  assertEquals(params.site_id, "example.com");
  assertEquals(params.date_range, "7d");
  assertEquals(params.metrics.length, 1);
});

Deno.test("Types - QueryParams with optional fields", () => {
  const params: QueryParams = {
    site_id: "example.com",
    date_range: "7d",
    metrics: ["visitors"],
    filters: [["is", "event:page", ["/home"]]],
    limit: 100,
    offset: 10,
  };

  assertEquals(params.filters?.[0]?.[1], "event:page");
  assertEquals(params.limit, 100);
  assertEquals(params.offset, 10);
});
