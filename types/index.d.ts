declare module "petal" {
  export type Maybe<T> = T | null;

  export interface SlashCommandOptionType {
    subcommand: 1;
    subcommandGroup: 2;
    string: 3;
    integer: 4;
    boolean: 5;
    user: 6;
    channel: 7;
    role: 8;
    mentionable: 9;
    number: 10;
  }

  export type DiscordSlashCommandOption<T> = {
    type: T;
    name: string;
    description: string;
    required?: boolean;
    options?: any[];
  };

  export type SlashCommandOption<T extends keyof SlashCommandOptionType> = {
    type: T;
    name: string;
    description: string;
    required?: boolean;
    autocomplete?: boolean;
    choices?: { name: string; value: string | number }[];
    min_value?: T extends "number"
      ? number | undefined
      : T extends "integer"
      ? number
      : undefined;
    max_value?: T extends "number"
      ? number | undefined
      : T extends "integer"
      ? number
      : undefined;
    options?: T extends "subcommand"
      ? SlashCommandOption<keyof SlashCommandOptionType>[]
      : T extends "subcommandGroup"
      ? SlashCommandOption<"subcommandGroup">[]
      : undefined;
  };

  export type InteractionOption<T extends boolean> = {
    name: string;
    value: string | number | boolean;
    focused?: T;
    options?: InteractionOption<T>[];
  };

  export type CommandInteraction = {
    interaction: import("eris").CommandInteraction;
    options: { options: InteractionOption<boolean>[] };
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
    createdAt: number;
    stats: {
      cardCount: number;
      gtsTotalGames: number;
      gtsGuessCount: number;
      gtsTotalTime: number;
      gtsTotalRewards: number;
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
  };

  export type Song = {
    id: number;
    title: string;
    group: string;
    video: string;
    maxReward: number;
    timeLimit: number;
    maxGuesses: number;
  };

  export type GTS = {
    startedAt: number;
    maxReward: number;
    timeLimit: number;
    maxGuesses: number;
    playerId: number;
    gameMessageId: string;
    song: Song;
    guesses: number;
    correct: boolean;
  };
}
