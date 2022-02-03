import axios from "axios";
import { Message, TextChannel } from "eris";
import { bot } from "..";
import { prefabCreationManager } from "../lib/mod/createCard";
import { Embed } from "../struct/embed";
import { Event } from "../struct/event";

const run = async function (msg: Message) {
  if (msg.guildID !== process.env.STAFF_SERVER_ID) return;
  if (!msg.mentions.find((u) => u.id === bot.user.id)) return;

  const instance = prefabCreationManager.getInstance(msg.author);
  if (!instance) return;

  const attachment = msg.attachments[0];
  if (!attachment) return;

  prefabCreationManager.setImage(msg.author, attachment.url);

  const card = (await axios.post(`${process.env.ONI_URL}/card`, [
    {
      character: attachment.url,
      frame: "#FFAACC",
      name: "Prefab",
      id: Date.now(),
    },
  ])) as { data: { card: string } };

  const channel = (await bot.getRESTChannel(msg.channel.id)) as TextChannel;

  const embed = new Embed()
    .setDescription(
      `**Prefab Review**\nPlease review the prefab information above, and the attached image.\nIf it all looks correct, press the button below.\n\nOtherwise, you may send another message or wait for the timer to expire.`
    )
    .setImage("attachment://collage.png");

  await channel.createMessage(
    {
      embeds: [embed],
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              custom_id: `confirm_prefab_${
                instance.isEdit ? "edit" : "creation"
              }`,
              label: "Confirm",
              style: 3,
            },
          ],
        },
      ],
    },
    [{ file: Buffer.from(card.data.card, "base64"), name: "collage.png" }]
  );
};

export default new Event(["messageCreate"], run);
