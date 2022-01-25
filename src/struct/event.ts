import { EventListeners } from "eris";

type Events = (keyof EventListeners)[];
type Run = (...params: any[]) => Promise<unknown> | unknown;

export class Event {
  events: Events;
  run: Run;

  constructor(events: Events, run: Run) {
    this.events = events;
    this.run = run;
  }
}
