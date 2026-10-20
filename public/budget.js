// Weekly calorie budget math, shared by the web app and the MCP function (netlify/lib/mcp.ts).

/** Share of workout burn that is added back to the weekly allotment. Burn estimates run high, so keep it small. */
export const EAT_BACK = 0.25;

/**
 * The week's allotment once workouts are counted, and the day's adjusted budget: what's left of
 * the allotment spread over the rest of the week (the day itself included).
 *
 * @param {{ weekly: number, burned: number, eatenBefore: number, daysLeft: number }} week
 *   weekly: the goal's weekly calories; burned: calories burned in the week up to and including the day;
 *   eatenBefore: calories eaten earlier in the week; daysLeft: days from the day to the week's end, inclusive.
 */
export function weekBudget({ weekly, burned, eatenBefore, daysLeft }) {
  const earned = Math.round(burned * EAT_BACK);
  const goal = weekly + earned;
  const adjusted = Math.max(0, (goal - eatenBefore) / daysLeft);
  return { earned, goal, adjusted };
}
