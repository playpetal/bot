import { expect } from "chai";
import { displayName } from "../../src/lib/util/displayName";
import { emphasis } from "../../src/lib/util/formatting/emphasis";

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
      expect(emphasis("Test!")).to.equal("**Test!**");
      expect(emphasis(7270)).to.equal("**7,270**");
    });
  });
});
