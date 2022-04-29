import { logger } from "../lib/logger";
import { Event } from "../struct/event";

const run = async function (e: Error) {
  logger.error(e.toString());
};

export default new Event(["error"], run);
