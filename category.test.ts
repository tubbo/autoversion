import { test, expect } from "vitest";
import { Category } from "./category.js";
import { Config } from "./config.js";

const category = new Category(
  {
    title: "New Features",
    version: "minor",
    labels: ["feature"],
    exclude: {
      authors: ["categorically-ignored"],
      labels: ["dependencies"],
    },
  },
  new Config({
    exclude: {
      authors: ["globally-ignored"],
      labels: ["ignore"],
    },
    categories: [],
  }),
);

test("supersedes bump", () => {
  expect(category.supersedes("patch")).toBe(true);
  expect(category.supersedes("major")).toBe(false);
});

test("includes changeset from specified labels", () => {
  expect(category.includes({ author: "allowed", labels: ["feature"] })).toBe(
    true,
  );
  expect(category.includes({ author: "allowed", labels: ["bug"] })).toBe(false);
});

test("excludes changeset matching config", () => {
  expect(
    category.includes({ author: "globally-ignored", labels: ["feature"] }),
  ).toBe(false);
  expect(
    category.includes({ author: "categorically-ignored", labels: ["feature"] }),
  ).toBe(false);
  expect(
    category.includes({ author: "allowed", labels: ["feature", "ignore"] }),
  ).toBe(false);
  expect(
    category.includes({
      author: "allowed",
      labels: ["feature", "dependencies"],
    }),
  ).toBe(false);
});
