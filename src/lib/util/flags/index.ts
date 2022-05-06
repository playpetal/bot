export const FLAGS = {
  DEVELOPER: 0,
  RELEASE_MANAGER: 1,
  PUBLIC_SUPPORTER: 2,
  MINIGAMES_USE_BIAS_LIST: 3,
  GAME_DESIGNER: 4,
} as const;

export function hasFlag(flag: keyof typeof FLAGS, flags: number) {
  const binary = Number(flags.toString(2));
  return binary & (1 << FLAGS[flag]);
}
