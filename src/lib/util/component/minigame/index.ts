import { button, row } from "..";

export function getGTSRewardComponents(userId: number) {
  return [
    row(
      button({
        customId: `claim-gts-reward?${userId}&card`,
        label: "random card",
        emoji: "941818546026061885",
        style: "gray",
      }),
      button({
        customId: `claim-gts-reward?${userId}&petal`,
        label: "5 petals",
        emoji: "930918815225741383",
        style: "gray",
      })
    ),
  ];
}