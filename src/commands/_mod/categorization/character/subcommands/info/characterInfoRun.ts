import { Run } from "petal";
import { getCharacter } from "../../../../../../lib/graphql/query/categorization/character/getCharacter";
import { Embed } from "../../../../../../struct/embed";
import { BotError } from "../../../../../../struct/error";

const run: Run = async ({ courier, options }) => {
  const strCharacterId = options.getOption<string>("character")!;
  const characterId = parseInt(strCharacterId, 10);

  if (isNaN(characterId))
    throw new BotError(
      "**uh-oh!**\nplease select a character from the dropdown!"
    );

  const character = await getCharacter(characterId);

  if (!character)
    throw new BotError(
      "**uh-oh!**\nplease select a character from the dropdown!"
    );

  const birthday = character.birthday
    ? new Date(character.birthday).toLocaleString("en-us", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      })
    : "None";

  const embed = new Embed().setDescription(
    `**Character Info**\nName: **${
      character.name
    }**\nBirthday: **${birthday}**\nGender: **${
      character.gender || "None"
    }**\nID: **${character.id}**`
  );

  await courier.send({ embeds: [embed] });
  return;
};

export default run;
