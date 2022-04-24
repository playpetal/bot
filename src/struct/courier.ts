import {
  AutocompleteInteraction,
  CommandInteraction,
  FileContent,
  InteractionContent,
  Message,
  TextableChannel,
} from "eris";
import { AutocompleteChoice } from "petal";

type CourierInteraction =
  | CommandInteraction<TextableChannel>
  | AutocompleteInteraction<TextableChannel>
  | undefined;
export class Courier {
  public readonly interaction: CourierInteraction;
  private responses: InteractionContent[] = [];

  constructor(interaction: CourierInteraction) {
    this.interaction = interaction;
  }

  public async send<T extends CourierInteraction>(
    content: T extends AutocompleteInteraction
      ? AutocompleteChoice[]
      : InteractionContent,
    files?: FileContent | FileContent[]
  ): Promise<Message<TextableChannel> | undefined> {
    if (this.interaction instanceof CommandInteraction || !this.interaction) {
      this.responses.push(content as InteractionContent);
    }

    if (!this.interaction) return;

    if (this.interaction instanceof CommandInteraction) {
      const message = await this.interaction.createFollowup(
        content as InteractionContent,
        files
      );
      return message;
    } else {
      await this.interaction.acknowledge(content as AutocompleteChoice[]);
      return;
    }
  }

  public async edit(
    content: InteractionContent,
    files?: FileContent | FileContent[]
  ): Promise<any> {
    this.responses.push(content);

    if (!this.interaction) return;

    const message = await (
      this.interaction as CommandInteraction
    ).editOriginalMessage(content, files);
    return message;
  }

  public getInitialResponse(): InteractionContent | undefined {
    return this.responses[0];
  }
}
