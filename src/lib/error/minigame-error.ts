import { PartialUser } from "petal";
import { BotError } from "../../struct/error";
import { button, row } from "../util/component";

export const MinigameError = {
  AlreadyPlayingMinigame: new BotError(
    "**you're already playing something!**\nfinish your current minigame first 😒"
  ),
  AlreadyPlayingGTS: new BotError(
    "**you're already guessing a song!**\nyou can use **`/song guess`** to guess."
  ),
  AlreadyPlayingWords: ({
    message,
    channel,
    guild,
    user,
  }: {
    message: string;
    channel: string;
    guild: string;
    user: PartialUser;
  }) =>
    new BotError(
      `**you're currently playing petle!**\nclick [here](https://discord.com/channels/${guild}/${channel}/${message}) to return to your game.`,
      [
        row(
          button({
            customId: `bump-words?${user.id}`,
            style: "gray",
            label: "bump game",
          }),
          button({
            customId: `cancel-words?${user.id}`,
            style: "red",
            label: "cancel game",
          })
        ),
      ]
    ),
  InvalidMinigame: new BotError(
    `**that minigame doesn't exist!**\neither you already claimed rewards, or an error occurred.`
  ),
  MaxWordsGuessed: new BotError(
    "**you've guessed six words already!**\nyou can't guess any more."
  ),
  NoAvailableSongs: new BotError(
    "there are no available songs 😔 try again later!"
  ),
  NotOwnerOfMinigame: new BotError(
    `**that game isn't yours!**\nyou can't claim rewards for someone else's minigame.`
  ),
  NotPlayingGTS: new BotError(
    "**you're not playing!**\nuse **`/song`** to start a game."
  ),
  NotPlayingWords: new BotError(
    "**you're not playing!**\nuse **`/petle play`** to start a game."
  ),
  WordAlreadyGuessed: new BotError(
    "**you've already used that word!**\nit wouldn't make much sense to use it again..."
  ),
  WordNotValid: new BotError(
    "**that word isn't in the word list!**\nremember, all the available words are kpop related."
  ),
} as const;
