import { slashCommand } from "../../../../lib/command";
import { CONSTANTS } from "../../../../lib/constants";
import run from "./inventoryRun";
import { default as autocompleteCharacter } from "./autocomplete/character";
import { default as autocompleteSubgroup } from "./autocomplete/subgroup";
import { autocompleteGroup } from "./autocomplete/group";
import { default as autocompleteTag } from "./autocomplete/tag";

export default slashCommand("inventory")
  .desc("shows you a list of your cards")
  .option({
    type: CONSTANTS.OPTION_TYPE.USER,
    name: "user",
    description: "the user whose inventory you'd like to view",
  })
  .option({
    type: CONSTANTS.OPTION_TYPE.STRING,
    name: "character",
    description: "show only this character",
    autocomplete: true,
    runAutocomplete: autocompleteCharacter,
  })
  .option({
    type: CONSTANTS.OPTION_TYPE.STRING,
    name: "subgroup",
    description: "show only this subgroup",
    autocomplete: true,
    runAutocomplete: autocompleteSubgroup,
  })
  .option({
    type: CONSTANTS.OPTION_TYPE.STRING,
    name: "group",
    description: "show only this group",
    autocomplete: true,
    runAutocomplete: autocompleteGroup,
  })
  .option({
    type: CONSTANTS.OPTION_TYPE.STRING,
    name: "sort",
    description: "what property you want to sort your cards by",
    choices: [
      { name: "character", value: "character" },
      { name: "code", value: "code" },
      { name: "group", value: "group" },
      { name: "issue", value: "issue" },
      { name: "stage", value: "stage" },
      { name: "subgroup", value: "subgroup" },
    ],
  })
  .option({
    type: CONSTANTS.OPTION_TYPE.STRING,
    name: "order",
    description: "the order you want to sort by (default is ascending)",
    choices: [
      { name: "ascending", value: "ascending" },
      { name: "descending", value: "descending" },
    ],
  })
  .option({
    type: CONSTANTS.OPTION_TYPE.STRING,
    name: "tag",
    description: "show only cards tagged with a certain tag",
    autocomplete: true,
    runAutocomplete: autocompleteTag,
  })
  .run(run);
