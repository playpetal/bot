declare module "petal" {
  export type Maybe<T> = T | null;

  export type DiscordLocale =
    | "da"
    | "de"
    | "en-GB"
    | "en-US"
    | "es-ES"
    | "fr"
    | "hr"
    | "it"
    | "lt"
    | "hu"
    | "nl"
    | "no"
    | "pl"
    | "pt-BR"
    | "ro"
    | "fi"
    | "sv-SE"
    | "vi"
    | "tr"
    | "cs"
    | "el"
    | "bg"
    | "ru"
    | "uk"
    | "hi"
    | "th"
    | "zh-CN"
    | "ja"
    | "zh-TW"
    | "ko";

  export type DiscordLocalization = { [key in DiscordLocale]: string };

  export type DiscordChannelType =
    | 0
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15;

  export type DiscordCreateApplicationCommand = {
    name: string;
    name_localizations?: DiscordLocalization[];
    description: string;
    description_localizations?: DiscordLocalization[];
    options?: DiscordCreateApplicationCommandOption<SlashCommandOptionType>[];
    default_permission?: boolean;
    type: 1 | 2 | 3;
  };

  export type DiscordCreateApplicationCommandOption<
    T extends SlashCommandOptionType
  > = {
    type: T extends 1
      ? SlashCommandOptionTypeWithoutSubcommand
      : T extends 2
      ? 1
      : SlashCommandOptionType;
    name: string;
    name_localizations?: DiscordLocalization[];
    description: string;
    description_localizations?: DiscordLocalization[];
    required?: boolean;
    choices?: { name: string; value: string | number }[];
    options?: DiscordCreateApplicationCommandOption<SlashCommandOptionType>[];
    channel_types?: DiscordChannelType[];
    min_value?: number;
    max_value?: number;
    autocomplete?: boolean;
  };

  type Emoji = {
    id: string | null;
  };

  type Components = {
    type: 1;
    components: (Button | Select)[];
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

  type Select = {
    type: 3;
    custom_id: string;
    options: SelectOption[];
    placeholder?: string;
    min_values?: number;
    max_values?: number;
    disabled?: boolean;
  };

  type SelectOption = {
    label: string;
    value: string;
    description?: string;
    emoji?: Emoji;
    default?: boolean;
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

  export type Run = ({
    courier,
    interaction,
    user,
    options,
  }: {
    courier: import("../src/struct/courier").Courier;
    interaction:
      | import("eris").CommandInteraction
      | import("eris").AutocompleteInteraction;
    user: PartialUser;
    options: import("../src/struct/options").InteractionOptions;
  }) => unknown;

  export type SlashCommandSubcommand = {
    type: 1;
    name: string;
    name_localizations?: DiscordLocalization[];
    description: string;
    description_localizations?: DiscordLocalization[];
    options?: SlashCommandOption[];

    ephemeral?: boolean;
    run?: Run;
  };

  export type SlashCommandSubcommandGroup = {
    type: 2;
    name: string;
    name_localizations?: DiscordLocalization[];
    description: string;
    description_localizations?: DiscordLocalization[];
    options?: SlashCommandSubcommand[];
  };

  export type SlashCommandOptionNumeric = {
    type: 4 | 10;
    name: string;
    name_localizations?: DiscordLocalization[];
    description: string;
    description_localizations?: DiscordLocalization[];
    required?: boolean;
    autocomplete?: boolean;
    choices?: { name: string; value: number }[];
    min_value?: number;
    max_value?: number;

    runAutocomplete?: Run;
  };

  export type SlashCommandOptionString = {
    type: 3;
    name: string;
    name_localizations?: DiscordLocalization[];
    description: string;
    description_localizations?: DiscordLocalization[];
    required?: boolean;
    autocomplete?: boolean;
    choices?: { name: string; value: string }[];

    runAutocomplete?: Run;
  };

  export type SlashCommandOption = {
    type: SlashCommandOptionTypeWithoutSubcommand;
    name: string;
    name_localizations?: DiscordLocalization[];
    description: string;
    description_localizations?: DiscordLocalization[];
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

  export type MinigameStats<T extends MinigameType> = {
    type: T;
    totalAttempts: number;
    totalCards: number;
    totalCurrency: number;
    totalGames: number;
    totalPremiumCurrency: number;
    totalTime: number;
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
  type MinigameType =
    | "GUESS_THE_SONG"
    | "GUESS_THE_IDOL"
    | "GUESS_THE_GROUP"
    | "TRIVIA";

  export type MinigameState =
    | "PLAYING"
    | "CANCELLED"
    | "FAILED"
    | "PENDING"
    | "COMPLETED";

  export type MinigameSong = {
    title: string;
    group: Maybe<string>;
    soloist: Maybe<string>;
  };

  export type Minigame<T extends MinigameType> = T extends "GUESS_THE_SONG"
    ? GuessTheSong
    : T extends "GUESS_THE_IDOL"
    ? GuessTheIdol
    : T extends "TRIVIA"
    ? Trivia
    : GuessTheSong | GuessTheIdol | Trivia;

  export type MinigameComparison = "GREATER" | "LESS" | "EQUAL";

  export type GuessTheSong = {
    type: "GUESS_THE_SONG";
    accountId: number;
    video: Maybe<string>;
    state: MinigameState;
    song: Maybe<MinigameSong>;
    attempts: MinigameSong[];
    maxAttempts: number;
    timeLimit: number;
    startedAt: number;
    elapsed: Maybe<number>;

    messageId: string;
    channelId: string;
    guildId: string;
  };

  export type GuessTheIdolCharacter = Character & {
    nameLength: MinigameComparison;
    birthDate: MinigameComparison;
    isGender: boolean;
  };

  export type GuessTheIdol = {
    type: "GUESS_THE_IDOL";
    accountId: number;
    state: MinigameState;
    character: Maybe<Character>;
    attempts: GuessTheIdolCharacter[];
    maxAttempts: number;
    timeLimit: number;
    startedAt: number;
    elapsed: Maybe<number>;
    group?: string;

    messageId: string;
    channelId: string;
    guildId: string;
  };

  export type Trivia = {
    type: "TRIVIA";
    accountId: number;
    state: MinigameState;
    question: string;
    answer: string | null;
    options: string[];
    maxAttempts: number;
    timeLimit: number;
    startedAt: number;
    elapsed: number | null;
    group?: string;

    messageId: string;
    channelId: string;
    guildId: string;
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

  export type LeaderboardType =
    | "PUBLIC_SUPPORTER"
    | "GUESS_THE_SONGxPETAL"
    | "GUESS_THE_SONGxCARD"
    | "GUESS_THE_SONGxLILY"
    | "GUESS_THE_SONGxTIME"
    | "GUESS_THE_IDOLxPETAL"
    | "GUESS_THE_IDOLxCARD"
    | "GUESS_THE_IDOLxLILY"
    | "GUESS_THE_IDOLxTIME"
    | "TRIVIAxTIME"
    | "TRIVIAxPETAL"
    | "TRIVIAxCARD"
    | "TRIVIAxLILY";

  export type Leaderboard = {
    account: PartialUser;
    value: number;
  };

  export type Announcement = {
    id: number;
    announcement: string;
    createdAt: number;
  };

  export type Bias = {
    account: {
      id: number;
      username: string;
      discordId: string;
      title: Maybe<{ title: string }>;
    };
    group: {
      id: number;
      name: string;
      creation?: Date;
      gender?: "MALE" | "FEMALE" | "COED" | null;
      aliases: { alias: string }[];
    };
  };

  export type AccountInput = {
    id?: number;
    discordId?: string;
    username?: string;
  };

  export type CardSuggestion = {
    id: number;
    groupName: string;
    subgroupName: string;
    suggestedBy: PartialUser;
    fulfilledBy: PartialUser | null;
    fulfilled: boolean;
    votes: CardSuggestionVote[];
    publicMessageId: string;
    privateMessageId: string;
  };

  export type CardSuggestionVote = { id: number; account: PartialUser };
}
