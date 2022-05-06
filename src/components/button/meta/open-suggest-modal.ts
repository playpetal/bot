import { Component, RunComponent } from "../../../struct/component";

const run: RunComponent = async ({ interaction }) => {
  await interaction.createModal({
    custom_id: "suggest",
    title: "suggest new cards!",
    components: [
      {
        type: 1,
        components: [
          {
            type: 4,
            custom_id: "suggest-group",
            label: "group name",
            placeholder: "example: BTS",
            required: true,
            style: 1,
          },
        ],
      },
      {
        type: 1,
        components: [
          {
            type: 4,
            custom_id: "suggest-subgroup",
            label: "subgroup name",
            placeholder: "example: Map of the Soul: 7",
            required: true,
            style: 1,
          },
        ],
      },
    ],
  });

  return;
};

export default new Component("open-suggest-modal").run(run);
