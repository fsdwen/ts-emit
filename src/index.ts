import {
  EmitArgs,
  Emitter,
  EventHandlerMap,
  EventType,
  Listener,
} from "./types";

export class EventEmitter<Events extends Record<EventType, unknown>>
  implements Emitter<Events>
{
  all: EventHandlerMap<any> = new Map();

  on<Key extends keyof Events>(
    event: Key,
    listener: Listener<Events[Key]>
  ): void {
    const existingListeners = this.all.get(event);
    if (existingListeners) {
      existingListeners.push(listener);
    } else {
      this.all.set(event, [listener]);
    }
  }

  off<Key extends keyof Events>(
    event: Key,
    listener: Listener<Events[Key]>
  ): void {
    const existingListeners = this.all.get(event) as
      | Listener<Events[Key]>[]
      | undefined;
    if (!existingListeners) {
      return;
    }
    const updatedListeners = existingListeners.filter((l) => l !== listener);
    if (updatedListeners.length > 0) {
      this.all.set(event, updatedListeners);
    } else {
      this.all.delete(event);
    }
  }

  emit<Key extends keyof Events>(
    event: Key,
    ...args: EmitArgs<Events[Key]>
  ): void {
    const existingListeners = this.all.get(event) as
      | Listener<Events[Key]>[]
      | undefined;
    if (existingListeners) {
      existingListeners.forEach((listener) => listener(...args));
    }
  }

  once<Key extends keyof Events>(
    event: Key,
    listener: Listener<Events[Key]>
  ): void {
    const onceListener: Listener<Events[Key]> = (...args) => {
      this.off(event, onceListener);
      listener(...args);
    };
    this.on(event, onceListener);
  }
}

export function mitt<Events extends Record<string, unknown>>() {
  return new EventEmitter<Events>();
}
