import { EmitArgs, Emitter, EventHandlerMap, Listener } from "./types";

export class EventEmitter<Events extends Record<string, unknown>>
  implements Emitter<Events>
{
  all: EventHandlerMap<any> = new Map();

  on<Key extends keyof Events, T = Events[Key]>(
    event: Key,
    listener: Listener<T>
  ): void {
    const existingListeners = this.all.get(event);
    if (existingListeners) {
      existingListeners.push(listener);
    } else {
      this.all.set(event, [listener]);
    }
  }

  off<Key extends keyof Events, T = Events[Key]>(
    event: Key,
    listener: Listener<T>
  ): void {
    const existingListeners = this.all.get(event) as Listener<T>[] | undefined;
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

  emit<Key extends keyof Events, T = Events[Key]>(
    event: Key,
    ...args: EmitArgs<T>
  ): void {
    const existingListeners = this.all.get(event) as Listener<T>[] | undefined;
    if (existingListeners) {
      existingListeners.forEach((listener) => listener(...args));
    }
  }

  once<Key extends keyof Events, T = Events[Key]>(
    event: Key,
    listener: Listener<T>
  ): void {
    const onceListener: Listener<T> = (...args) => {
      this.off(event, onceListener);
      listener(...args);
    };
    this.on(event, onceListener);
  }
}

export function mitt<Events extends Record<string, unknown>>() {
  return new EventEmitter<Events>();
}
