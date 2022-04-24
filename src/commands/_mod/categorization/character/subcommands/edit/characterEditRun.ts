import { Run, Gender } from "petal";
import { updateCharacter } from "../../../../../../lib/graphql/mutation/UPDATE_CHARACTER";
import { getCharacter } from "../../../../../../lib/graphql/query/categorization/character/getCharacter";
import { Embed } from "../../../../../../struct/embed";
import { BotError } from "../../../../../../struct/error";

const run: Run = async ({ courier, user, options }) => {
  const name = options.getOption<string>("name");
  const birthday = options.getOption<string>("birthday");
  const gender = options.getOption<"male" | "female" | "nonbinary">("gender");

  const strCharacterId = options.getOption<string>("character")!;
  const characterId = parseInt(strCharacterId, 10);

  if (isNaN(characterId))
    throw new BotError(
      "**uh-oh!**\nplease select a character from the dropdown!"
    );

  const character = await getCharacter(characterId);

  if (!character) {
    throw new BotError(
      "**uh-oh!**\nplease select a character from the dropdown!"
    );
  }

  if (!name && birthday === undefined && gender === undefined)
    throw new BotError(
      "**uh-oh!**\nyou didn't change anything about the character!"
    );

  const date = birthday ? new Date(birthday) : undefined;

  const newCharacter = await updateCharacter(
    user.discordId,
    character.id,
    name,
    date,
    gender?.toUpperCase() as Gender | undefined
  );

  await courier.send({
    embeds: [
      new Embed().setDescription(
        `the character **${newCharacter.name}** has been updated!\ncheck **/characterinfo \`${newCharacter.name}\`** to see the new info!`
      ),
    ],
  });
  return;
};

export default run;
