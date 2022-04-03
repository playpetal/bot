import { Courier } from "../../src/struct/courier";
import { InteractionOptions } from "../../src/struct/options";
import { expect } from "chai";
import { CONSTANTS } from "../../src/lib/constants";
import { pingRun } from "../../src/commands/general/ping/pingRun";

describe("commands", function () {
  describe("ping", function () {
    it("should correctly render default embed", async function () {
      const courier = new Courier(undefined);

      const options = new InteractionOptions([
        { type: CONSTANTS.OPTION_TYPE.STRING, name: "dev", value: false },
      ]);

      await pingRun({
        courier,
        user: {
          id: 0,
          username: "test",
          title: null,
          discordId: "test",
          flags: 0,
        },
        options,
        interaction: courier.interaction!,
      });

      expect(courier.getInitialResponse()?.embeds?.[0].description).includes(
        "if you're seeing this, it means the bot is connected to Discord!"
      );
    });
  });
});
