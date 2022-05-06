import { Run } from "petal";
import { createTriviaQuestion } from "../../../../../../lib/graphql/mutation/game/minigame/trivia/createTriviaQuestion";
import { searchGroups } from "../../../../../../lib/graphql/query/SEARCH_GROUPS";
import { emoji } from "../../../../../../lib/util/formatting/emoji";
import { Embed } from "../../../../../../struct/embed";
import { BotError } from "../../../../../../struct/error";

export const questionCreateRun: Run = async function run({
  courier,
  user,
  options,
}) {
  const groupName = options.getOption<string>("group")!;

  const groups = await searchGroups(groupName);

  if (groups.length === 0)
    throw new BotError(
      "**uh-oh!**\nthere are no groups that match your input.\nplease select a group from the autocomplete!"
    );

  if (groups.length > 1)
    throw new BotError(
      "**uh-oh!**\nthere are too many groups that match your input.\nplease select a group from the autocomplete!"
    );

  const question = options.getOption<string>("question")!;
  const answer = options.getOption<string>("answer")!;
  const [fake1, fake2, fake3] = [
    options.getOption<string>("fake1")!,
    options.getOption<string>("fake2")!,
    options.getOption<string>("fake3")!,
  ];

  const trivia = await createTriviaQuestion(
    user.discordId,
    question,
    answer,
    [fake1, fake2, fake3],
    groups[0]
  );

  const embed = new Embed().setDescription(
    `${emoji.check} **trivia question created for ${groups[0].name}!**\n${
      trivia.question
    }\n${trivia.solutions
      .map((s) => `${s.answer}${s.correct ? ` ${emoji.check}` : ``}`)
      .join("\n")}`
  );

  await courier.send({ embeds: [embed] });
  return;
};
