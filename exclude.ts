import { z } from "zod";
import { Validated } from "validated-extendable";
import type { Changeset } from "./service.js";

export const Exclusion = z.object({
  authors: z.optional(z.array(z.string())),
  labels: z.optional(z.array(z.string())),
});

export class Exclude extends Validated(Exclusion) {
  excludes({ author, labels }: Changeset) {
    if (this.value.authors?.includes(author)) return true;

    for (const label of labels) {
      if (this.value.labels?.includes(label)) return true;
    }

    return false;
  }
}
