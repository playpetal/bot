export function plural(number: number, unit: string, suffix?: string): string {
  if (number === 1) return `${number} ${unit}`;
  return `${number} ${unit}${suffix || "s"}`;
}

export function pluralOr(
  number: number,
  singular: string,
  plural: string
): string {
  if (number === 1) return singular;
  return plural;
}
