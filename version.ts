import { ReleaseType, SemVer } from "semver";
import { Config } from "./config.js";
import type { Service, Changeset } from "./service.js";
import { Category } from "./category.js";

export class Version {
  readonly config: Config;
  readonly changes: Changeset[];
  readonly current: SemVer;

  static async calculate(service: Service, config: Config) {
    const release = await service.latest();
    const changes = await service.diff(release);

    return new this(config, changes, release?.name);
  }

  constructor(config: Config, changes: Changeset[], current?: string) {
    this.config = config;
    this.changes = changes;
    this.current = new SemVer(current ?? "0.0.0");
  }

  get bump() {
    let bump: ReleaseType;
    const categories = this.config.categories.map(
      (category) => new Category(category, this.config),
    );

    for (const change of this.changes) {
      for (const category of categories) {
        if (category.includes(change) && category.supersedes(bump)) {
          bump = category.version;
        }
      }
    }

    return bump;
  }

  get next() {
    if (!this.bump) return;

    return this.current.inc(this.bump);
  }

  get bumped() {
    return !!this.bump;
  }

  toJSON() {
    return {
      current: this.current.toString(),
      next: this.next.toString(),
      bump: this.bump,
      bumped: this.bumped,
    };
  }
}
