import { expect, test } from "vitest";
import { Version } from "./version.js";
import { Config } from "./config.js";

test("calculate next version", () => {
  const config = new Config({
    categories: [
      {
        title: "Breaking Changes",
        labels: ["breaking"],
        version: "major" as const,
      },
    ],
  });
  const changes = [
    {
      author: "foo",
      labels: ["breaking"],
    },
  ];
  const version = new Version(config, changes);

  expect(version.bump).toEqual("major");
  expect(version.next.toString()).toEqual("1.0.0");
});
