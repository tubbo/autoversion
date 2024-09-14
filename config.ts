import { Validated } from "validated-extendable";
import { z } from "zod";
import { readFile } from "fs/promises";
import { load } from "js-yaml";
import { join } from "path";
import { Exclude, Exclusion } from "./exclude.js";
import { Categorization } from "./category.js";
import { Changeset } from "./service.js";

const Configuration = z.object({
  exclude: z.optional(Exclusion),
  categories: z.array(Categorization),
});

/**
 * Configuration for automatically generated release notes as well as the
 * autoversion action.
 */
export class Config extends Validated(Configuration) {
  /**
   * Read the configuration file and parse it as YAML.
   */
  static async read(...segments: string[]) {
    const path = join(...segments);

    try {
      const source = await readFile(path, "utf8");

      return this.load(source);
    } catch (cause) {
      throw new Error(`Config file not found at "${path}".`, { cause });
    }
  }

  /**
   * Parse YAML source as a Config file object.
   */
  static load(source: string) {
    try {
      const { changelog } = load(source) as { changelog: unknown };

      return new this(changelog);
    } catch (error) {
      throw new Error(`Error parsing config file: ${error.message}`, {
        cause: error,
      });
    }
  }

  get empty() {
    for (const category of this.categories) {
      if (category.version) return false;
    }

    return true;
  }

  excludes(change: Changeset) {
    const exclude = new Exclude(this.exclude ?? {});

    return exclude.excludes(change);
  }
}
