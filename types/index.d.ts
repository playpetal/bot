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

  export type DiscordSlashCommandOption<T> = {
    type: T;
    name: string;
    description: string;
    required?: boolean;
    options?: any[];
  };

  export type SlashCommandOption<T extends SlashCommandOptionType> = {
    type: T;
    name: string;
    description: string;
    required?: boolean;
    autocomplete?: boolean;
    ephemeral?: T extends 1 ? boolean : never;
    choices?: { name: string; value: string | number }[];
    min_value?: T extends 10
      ? number | undefined
      : T extends 4
      ? number
      : undefined;
    max_value?: T extends 10
      ? number | undefined
      : T extends 4
      ? number
      : undefined;
    options?: T extends 1
      ? SlashCommandOption<SlashCommandOptionType>[]
      : T extends 2
      ? SlashCommandOption<2>[]
      : undefined;
  };

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
  };

  export type Account = {
    id: number;
    discordId: string;
    username: string;
    title: Maybe<{ title: string }>;
    bio: Maybe<string>;
    currency: number;
    premiumCurrency: number;
    createdAt: number;
    stats: {
      cardCount: number;
      rollCount: number;
    };
    groups: {
      group: {
        name: string;
      };
    }[];
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
    }>;
    issue: number;
    quality: Quality;
    tint: number;
    createdAt: number;
    hasFrame: boolean;
  };

  export type Song = {
    id: number;
    title: string;
    group?: string;
    video?: string;
  };

  type Reward = "PETAL" | "LILY" | "CARD";
  type MinigameType = "GTS" | "WORDS";

  export type UnknownMinigame = {
    playerId: number;
    type: MinigameType;
    message: string;
    channel: string;
    guild: string;
    data: GTSData | WordsData;
  };

  export type Minigame<T extends MinigameType | never> = {
    playerId: number;
    type: T;
    message: string;
    channel: string;
    guild: string;
    data: T extends "GTS" ? GTSData : WordsData;
  };

  export type GTSData = {
    song: Song;
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
}
