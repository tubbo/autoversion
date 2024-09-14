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

export type Categorization = z.infer<typeof Categorization>;

export class Category extends Validated(Categorization) {
  config: Config;

  constructor(params: unknown, config: Config) {
    super(params);
    this.config = config;
  }

  excludes(change: Changeset) {
    const exclude = new Exclude(this.exclude ?? {});

    return this.config.excludes(change) || exclude.excludes(change);
  }

  includes(change: Changeset) {
    if (!this.excludes(change)) {
      for (const label of this.labels) {
        if (change.labels.includes(label)) return true;
      }
    }

    return false;
  }

  supersedes(bump: ReleaseType) {
    const levels = RELEASE_TYPES.toReversed();
    const current = levels.indexOf(bump);
    const proposed = levels.indexOf(this.version);

    return proposed > current;
  }
}
