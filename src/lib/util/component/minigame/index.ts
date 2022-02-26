import { button, row } from "..";

export async function getMinigameRewardComponents(
  userId: number,
  canClaimPremiumRewards: boolean = true
) {
  return [
    row(
      button({
        customId: `claim-minigame-reward?${userId}&card`,
        label: "random card",
        emoji: "941818546026061885",
        style: "gray",
      }),
      button({
        customId: `claim-minigame-reward?${userId}&petal`,
        label: "5 petals",
        emoji: "930918815225741383",
        style: "gray",
      }),
      button({
        customId: `claim-minigame-reward?${userId}&lily`,
        label: "1 lily",
        emoji: "946679737194008606",
        style: "gray",
        disabled: canClaimPremiumRewards ? false : true,
      })
    ),
  ];
}
