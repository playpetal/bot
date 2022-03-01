import { Components } from "petal";

export class BotError extends Error {
  components: Components = [];
  constructor(message: string, components?: Components) {
    super(message);
    this.name = "BotError";
    this.components = components || [];
  }
}
