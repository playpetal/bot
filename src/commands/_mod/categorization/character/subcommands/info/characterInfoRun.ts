import { Run } from "petal";
import { getCharacter } from "../../../../../../lib/graphql/query/categorization/character/getCharacter";
import { ErrorEmbed, Embed } from "../../../../../../struct/embed";

const run: Run = async ({ interaction, options }) => {
  const strCharacterId = options.getOption<string>("character")!;
  const characterId = parseInt(strCharacterId, 10);

  if (isNaN(characterId)) {
    return await interaction.createMessage({
      embeds: [new ErrorEmbed("please select a character from the dropdown!")],
    });
  }

  const character = await getCharacter(characterId);

  if (!character) {
    return await interaction.createMessage({
      embeds: [new ErrorEmbed("please select a character from the dropdown!")],
    });
  }

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

  await interaction.createMessage({ embeds: [embed] });
  return;
};

export default run;
