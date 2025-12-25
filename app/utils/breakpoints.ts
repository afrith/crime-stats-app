import { uniq } from "lodash-es";

export function calculateBreakpoints(
  data: number[],
  howMany: number
): number[] {
  if (data.length === 0) {
    return [];
  }

  const sorted = data.sort((a, b) => a - b);
  const nonZero = sorted.filter((d) => d > 0);

  const breaks = [sorted[0]];

  for (let i = 1; i < howMany; i++) {
    const rank = (i / howMany) * (nonZero.length + 1);
    if (rank > nonZero.length - 1) {
      breaks.push(nonZero[nonZero.length - 1]);
    } else {
      const intRank = Math.floor(rank);
      const frac = rank - intRank;
      const lower = nonZero[intRank - 1];
      const upper = nonZero[intRank];
      breaks.push(lower + frac * (upper - lower));
    }
  }

  breaks.push(nonZero[nonZero.length - 1]);

  return uniq(breaks);
}
