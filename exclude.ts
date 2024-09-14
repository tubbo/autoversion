import { z } from "zod";
import { Validated } from "validated-extendable";
import type { Changeset } from "./service.js";

export const Exclusion = z.object({
  authors: z.optional(z.array(z.string())),
  labels: z.optional(z.array(z.string())),
});

export class Exclude extends Validated(Exclusion) {
  excludes({ author, labels }: Changeset) {
    // @ts-expect-error TS2339
    if (this.authors?.includes(author)) return true;

    for (const label of labels) {
      // @ts-expect-error TS2339
      if (this.labels?.includes(label)) return true;
    }

    return false;
  }
}
