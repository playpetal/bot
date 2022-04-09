declare module "petal" {
  export type Maybe<T> = T | null;

  type Components = {
    type: 1;
    components: Button[];
  }[];

  type Button = {
    type: 2;
    label: string;
    custom_id: string;
    style: 1 | 2 | 3 | 4;
    emoji?: {
      id: string;
    };
    disabled: boolean;
  };

  export type SlashCommandOptionType =
    | 1 // subcommand
    | 2 // subcommand group
    | 3 // string
    | 4 // integer
    | 5 // boolean
    | 6
    | 7
    | 8
    | 9
    | 10 // number
    | 11;

  export type SlashCommandOptionTypeWithoutSubcommand =
    | 3 // string
    | 4 // integer
    | 5 // boolean
    | 6
    | 7
    | 8
    | 9
    | 10 // number
    | 11;

  export type DiscordSlashCommandOption<T> = {
    type: T;
    name: string;
    description: string;
    required?: boolean;
    options?: any[];
  };

  export type Run = ({
    courier,
    interaction,
    user,
    options,
  }: {
    courier: import("../src/struct/courier").Courier;
    interaction: import("eris").CommandInteraction;
    user: PartialUser;
    options: import("../src/struct/options").InteractionOptions;
  }) => Promise<unknown> | unknown;

  export type Autocomplete = ({
    interaction,
    user,
    options,
  }: {
    interaction: import("eris").AutocompleteInteraction;
    user: PartialUser;
    options: import("../src/struct/options").InteractionOptions;
  }) => Promise<unknown> | unknown;

  export type SlashCommandSubcommand = {
    type: 1;
    name: string;
    description: string;
    options?: SlashCommandOption[];

    ephemeral?: boolean;
    run?: Run;
  };

  export type SlashCommandSubcommandGroup = {
    type: 2;
    name: string;
    description: string;
    options?: SlashCommandSubcommand[];
  };

  export type SlashCommandOptionNumeric = {
    type: 4 | 10;
    name: string;
    description: string;
    required?: boolean;
    autocomplete?: boolean;
    choices?: { name: string; value: number }[];
    min_value?: number;
    max_value?: number;

    runAutocomplete?: Autocomplete;
  };

  export type SlashCommandOptionString = {
    type: 3;
    name: string;
    description: string;
    required?: boolean;
    autocomplete?: boolean;
    choices?: { name: string; value: string }[];

    runAutocomplete?: Autocomplete;
  };

  export type SlashCommandOption = {
    type: SlashCommandOptionTypeWithoutSubcommand;
    name: string;
    description: string;
    required?: boolean;
    autocomplete?: boolean;
    choices?: { name: string; value: string | number }[];
  };

  export type AnySlashCommandOption =
    | SlashCommandSubcommand
    | SlashCommandSubcommandGroup
    | SlashCommandOptionNumeric
    | SlashCommandOptionString
    | SlashCommandOption;

  export type InteractionOption = {
    type: SlashCommandOptionType;
    name: string;
    value: string | number | boolean;
    focused?: boolean;
    options?: InteractionOption[];
  };

  export type CommandInteraction = {
    interaction: import("eris").CommandInteraction;
    options: { options: InteractionOption[] };
  };

  export type PartialUser = {
    id: number;
    discordId: string;
    username: string;
    title: Maybe<{ title: string }>;
    flags: number;
  };

  export type Account = {
    id: number;
    discordId: string;
    username: string;
    flags: number;
    title: Maybe<{ title: string }>;
    bio: Maybe<string>;
    currency: number;
    premiumCurrency: number;
    createdAt: number;
    stats: {
      cardCount: number;
      rollCount: number;
    };
  };

  export type Prefab = {
    id: number;
    character: { id: number; name: string };
    group: Maybe<{ id: number; name: string }>;
    subgroup: Maybe<{ id: number; name: string }>;
    maxCards: number;
    rarity: number;
    release: Release;
  };

  export type Release = {
    id: number;
    droppable: boolean;
  };

  export type Character = {
    id: number;
    name: string;
    birthday: Date | null;
    gender: "MALE" | "FEMALE" | "NONBINARY" | null;
  };

  export type Group = {
    id: number;
    name: string;
    creation: Date;
    gender: "MALE" | "FEMALE" | "COED" | null;
    aliases: { alias: string }[];
  };

  export type Subgroup = {
    id: number;
    name: string;
    creation: Date;
  };

  export type Title = {
    id: number;
    title: string;
    description: string | null;
    ownedCount: number;
  };
  export type TitleInventory = {
    id: number;
    account: PartialUser;
    title: Title;
  };

  export type Gender = "MALE" | "FEMALE" | "NONBINARY";
  export type GroupGender = "MALE" | "FEMALE" | "COED";

  export type Quality = "SEED" | "SPROUT" | "BUD" | "FLOWER" | "BLOOM";

  export type Card = {
    id: number;
    prefab: {
      id: number;
      character: Character;
      subgroup: Maybe<Subgroup>;
      group: Maybe<Group>;
    };
    owner: Maybe<{
      id: number;
      discordId: string;
      username: string;
      title: Maybe<{ title: string }>;
      flags: number;
    }>;
    issue: number;
    quality: Quality;
    tint: number;
    createdAt: number;
    hasFrame: boolean;
    tag: Maybe<Tag>;
  };

  export type Song = {
    id: number;
    title: string;
    group: Maybe<{
      name: string;
    }>;
    soloist: Maybe<{
      name: string;
    }>;
    release: {
      id: number;
    };
  };

  export type GameSong = {
    id: number;
    title: string;
    group?: string;
    soloist?: string;
    video?: string;
  };

  type Reward = "PETAL" | "LILY" | "CARD";
  type MinigameType = "GTS" | "WORDS" | "GUESS_CHARACTER";

  export type UnknownMinigame = {
    playerId: number;
    type: MinigameType;
    message: string;
    channel: string;
    guild: string;
    data: GTSData | WordsData | CharacterGuessData;
  };

  export type Minigame<T extends MinigameType | never> = {
    playerId: number;
    type: T;
    message: string;
    channel: string;
    guild: string;
    data: T extends "GTS"
      ? GTSData
      : T extends "GUESS_CHARACTER"
      ? CharacterGuessData
      : WordsData;
  };

  export type GTSData = {
    song: GameSong;
    guesses: number;
    correct: boolean;
    elapsed?: number;
    startedAt: number;
  };

  export type WordsData = {
    answer: string;
    guesses: string[];
    elapsed?: number;
    startedAt: number;
  };

  export type CharacterGuessData = {
    type: "GUESS_CHARACTER";
    answer: Character;
    guesses: Character[];
    elapsed?: number;
    startedAt: number;
  };

  export type Product = {
    id: number;
    name: string;
    available: boolean;
    price: number;
  };

  export type Payment = {
    id: number;
    accountId: number;
    cost: number;
    paymentId: string;
    productId: string;
    success: boolean;
    url: string;
  };

  export type InventorySortOption =
    | "issue"
    | "code"
    | "group"
    | "subgroup"
    | "character"
    | "stage";
  export type InventorySort =
    | "ISSUE"
    | "CODE"
    | "GROUP"
    | "SUBGROUP"
    | "CHARACTER"
    | "STAGE";

  export type InventoryOrderOption = "ascending" | "descending";
  export type InventoryOrder = "ASC" | "DESC";

  export type AutocompleteChoice = { name: string; value: string };

  export type Tag = {
    id: number;
    tag: string;
    emoji: string;
    accountId: number;
    updatedAt: string;
    cardCount: number;
  };
}
