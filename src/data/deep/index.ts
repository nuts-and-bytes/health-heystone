import { DEEP_PART1 } from "./part1";
import { DEEP_PART2 } from "./part2";
import type { DeepDive } from "./types";

export type { DeepDive };

export const DEEP_DIVES: DeepDive[] = [...DEEP_PART1, ...DEEP_PART2];

const BY_SLUG = new Map(DEEP_DIVES.map((d) => [d.slug, d]));

export const getDeep = (slug: string) => BY_SLUG.get(slug);
