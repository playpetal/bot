import { Event } from "../struct/event";

const run = async function (e: Error) {
  console.error(e);
};

export default new Event(["error"], run);
