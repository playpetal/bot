import { BotError } from "../../struct/error";

export const MinigameError = {
  AlreadyPlayingMinigame: new BotError(
    "**you're already playing something!**\nfinish your current minigame first 😒"
  ),
  AlreadyPlayingGTS: new BotError(
    "**you're already guessing a song!**\nyou can use **`/guess`** to guess."
  ),
  AlreadyPlayingWords: new BotError(
    "**you're already guessing a word!**\nyou can use **`/petle guess`** to guess."
  ),
  MaxWordsGuessed: new BotError(
    "**you've guessed six words already!**\nyou can't guess any more."
  ),
  NoAvailableSongs: new BotError(
    "there are no available songs 😔 try again later!"
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
