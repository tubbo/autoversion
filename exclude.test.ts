import { test, expect } from "vitest";
import { Exclude } from "./exclude.js";

const exclude = new Exclude({
  authors: ["foo"],
  labels: ["ignore"],
});

test("excludes author", () => {
  expect(exclude.excludes({ author: "foo", labels: ["bar"] })).toBe(true);
  expect(exclude.excludes({ author: "bar", labels: ["foo"] })).toBe(false);
});

test("excludes labels", () => {
  expect(exclude.excludes({ author: "bar", labels: ["ignore"] })).toBe(true);
  expect(exclude.excludes({ author: "bar", labels: ["keep"] })).toBe(false);
});
