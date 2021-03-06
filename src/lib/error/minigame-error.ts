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
  AlreadyPlayingIdols: new BotError(
    "**you're currently guessing idols!**\nplease use **/minigame guess `idol: idol name`** to guess!"
  ),
  AlreadyPlayingTrivia: new BotError(
    "**you're already playing trivia!**\nmake your guess by clicking one of the buttons!"
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
  NotOwnerOfMinigame: new BotError(
    `**that game isn't yours!**\nyou can't claim rewards for someone else's minigame.`
  ),
  NotPlayingMinigame: new BotError(
    "**you're not playing a minigame!**\nuse **`/minigame play`** to start a game."
  ),
  NotPlayingGTS: new BotError(
    "**you're not playing!**\nuse **`/song`** to start a game."
  ),
  NotPlayingWords: new BotError(
    "**you're not playing!**\nuse **`/petle play`** to start a game."
  ),
  RewardsPendingClaim: new BotError(
    `**you have unclaimed rewards!**\nplease claim them to start a new minigame.`
  ),
  WordAlreadyGuessed: new BotError(
    "**you've already used that word!**\nit wouldn't make much sense to use it again..."
  ),
  WordNotValid: new BotError(
    "**that word isn't in the word list!**\nremember, all the available words are kpop related."
  ),
} as const;
