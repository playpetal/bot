import { BotError } from "../../struct/error";

export const MinigameError = {
  AlreadyPlayingMinigame: new BotError(
    "**you're already playing something!**\nfinish your current minigame first 😒"
  ),
  AlreadyPlayingGTS: new BotError(
    "**you're already guessing a song!**\nyou can use **`/guess`** to guess."
  ),
  NoAvailableSongs: new BotError(
    "there are no available songs 😔 try again later!"
  ),
  NotPlayingGTS: new BotError(
    "**you're not playing!**\nuse **/song** to start a game."
  ),
} as const;
