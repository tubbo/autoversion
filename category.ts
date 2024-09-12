import { z } from "zod";
import { Validated } from "validated-extendable";
import type { Config } from "./config.js";
import { Exclude, Exclusion } from "./exclude.js";
import type { Changeset } from "./service.js";
import { RELEASE_TYPES, type ReleaseType } from "semver";

export const Categorization = z.object({
  title: z.string(),
  labels: z.array(z.string()),
  version: z.optional(z.enum(["major", "minor", "patch"])),
  exclude: z.optional(Exclusion),
});

export class Category extends Validated(Categorization) {
  config: Config;

  constructor(params: unknown, config: Config) {
    super(params);
    this.config = config;
  }

  get exclude() {
    return new Exclude(this.value.exclude);
  }

  get version() {
    return this.value.version;
  }

  includes(change: Changeset) {
    return !this.config.excludes(change) && !this.exclude.excludes(change);
  }

  supersedes(bump: ReleaseType) {
    const current = RELEASE_TYPES.indexOf(bump);
    const proposed = RELEASE_TYPES.indexOf(this.version);

    return proposed > current;
  }
}
