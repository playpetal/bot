import { Run } from "petal";
import { button, row } from "../../../../../lib/util/component";
import { Embed } from "../../../../../struct/embed";

export const suggestCardsRun: Run = async function ({ courier }) {
  const embed = new Embed()
    .setDescription(
      `**got cards you want added to petal?**\nsubmit a card suggestion!\n\nbefore suggesting, make sure:\n**1)** your suggestion isn't already in petal!`
    )
    .setFooter("misuse of the suggestions may get the privilege taken away!");

  await courier.send({
    embeds: [embed],
    components: [
      row(
        button({
          customId: "open-suggest-modal",
          style: "blue",
          label: "suggest cards!",
        })
      ),
    ],
  });
  return;
};
