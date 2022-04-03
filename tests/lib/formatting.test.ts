import { expect } from "chai";
import { displayName } from "../../src/lib/util/displayName";
import { strong } from "../../src/lib/util/formatting/strong";

describe("lib", () => {
  describe("formatting", () => {
    it("should correctly render display names", () => {
      const name = displayName({
        username: "Test",
        title: { title: "%u the Tester" },
        id: 0,
        discordId: "TEST",
        flags: 0,
      });

      expect(name).to.equal("**Test** the Tester");
    });

    it("should correctly strong-ify text and numbers", () => {
      expect(strong("Test!")).to.equal("**Test!**");
      expect(strong(7270)).to.equal("**7,270**");
    });
  });
});
