import { BotError } from "../../struct/error";

export const TitleError = {
  TitleNotFound: new BotError(
    `**oops!**\ni couldn't find that title. make sure your spelling is correct!`
  ),
} as const;
