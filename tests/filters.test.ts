import { assertEquals } from "@std/assert";
import type { Filter, LogicalFilter, SimpleFilter } from "../src/types.ts";

Deno.test("Filter types - simple is filter", () => {
  const filter: SimpleFilter = ["is", "event:page", ["/home"]];

  assertEquals(filter[0], "is");
  assertEquals(filter[1], "event:page");
  assertEquals(filter[2], ["/home"]);
});

Deno.test("Filter types - simple is_not filter", () => {
  const filter: SimpleFilter = ["is_not", "visit:country", ["US", "CA"]];

  assertEquals(filter[0], "is_not");
  assertEquals(filter[1], "visit:country");
  assertEquals(filter[2].length, 2);
});

Deno.test("Filter types - contains filter", () => {
  const filter: SimpleFilter = ["contains", "event:page", ["/blog"]];

  assertEquals(filter[0], "contains");
  assertEquals(filter[1], "event:page");
  assertEquals(filter[2], ["/blog"]);
});

Deno.test("Filter types - contains_not filter", () => {
  const filter: SimpleFilter = ["contains_not", "event:page", ["/admin", "/api"]];

  assertEquals(filter[0], "contains_not");
  assertEquals(filter[2].length, 2);
});

Deno.test("Filter types - matches regex filter", () => {
  const filter: SimpleFilter = ["matches", "event:page", ["^/blog/.*"]];

  assertEquals(filter[0], "matches");
  assertEquals(filter[2][0], "^/blog/.*");
});

Deno.test("Filter types - matches_not regex filter", () => {
  const filter: SimpleFilter = ["matches_not", "event:page", ["^/admin/.*"]];

  assertEquals(filter[0], "matches_not");
  assertEquals(filter[2][0], "^/admin/.*");
});

Deno.test("Filter types - logical AND filter", () => {
  const filter: LogicalFilter = [
    "and",
    [
      ["is", "visit:country", ["US"]],
      ["contains", "event:page", ["/blog"]],
    ],
  ];

  assertEquals(filter[0], "and");
  assertEquals(Array.isArray(filter[1]), true);
  assertEquals(filter[1].length, 2);
});

Deno.test("Filter types - logical OR filter", () => {
  const filter: LogicalFilter = [
    "or",
    [
      ["is", "visit:device", ["Desktop"]],
      ["is", "visit:device", ["Laptop"]],
    ],
  ];

  assertEquals(filter[0], "or");
  assertEquals(filter[1].length, 2);
});

Deno.test("Filter types - logical NOT filter", () => {
  const filter: LogicalFilter = [
    "not",
    [
      ["is", "visit:country", ["US"]],
    ],
  ];

  assertEquals(filter[0], "not");
  assertEquals(filter[1].length, 1);
});

Deno.test("Filter types - nested logical filters", () => {
  const filter: LogicalFilter = [
    "and",
    [
      ["is", "visit:country", ["US"]],
      [
        "or",
        [
          ["contains", "event:page", ["/blog"]],
          ["contains", "event:page", ["/news"]],
        ],
      ],
    ],
  ];

  assertEquals(filter[0], "and");
  assertEquals(filter[1].length, 2);

  const nestedFilter = filter[1][1] as LogicalFilter;
  assertEquals(nestedFilter[0], "or");
  assertEquals(nestedFilter[1].length, 2);
});

Deno.test("Filter types - complex real-world filter", () => {
  const filter: Filter = [
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

  assertEquals((filter as LogicalFilter)[1].length, 3);
});

Deno.test("Filter types - custom property filter", () => {
  const filter: SimpleFilter = ["is", "event:props:plan", ["premium", "enterprise"]];

  assertEquals(filter[1], "event:props:plan");
  assertEquals(filter[2].length, 2);
});

Deno.test("Filter types - UTM campaign filter", () => {
  const filter: SimpleFilter = ["is", "visit:utm_campaign", ["summer-sale"]];

  assertEquals(filter[1], "visit:utm_campaign");
  assertEquals(filter[2][0], "summer-sale");
});

Deno.test("Filter types - browser filter", () => {
  const filter: SimpleFilter = ["is", "visit:browser", ["Chrome", "Firefox", "Safari"]];

  assertEquals(filter[1], "visit:browser");
  assertEquals(filter[2].length, 3);
});
