export const FLAGS = {
  DEVELOPER: 0,
  RELEASE_MANAGER: 1,
  PUBLIC_SUPPORTER: 2,
} as const;

export function hasFlag(flag: keyof typeof FLAGS, flags: number) {
  const binary = Number(flags.toString(2));
  return binary & (1 << FLAGS[flag]);
}
