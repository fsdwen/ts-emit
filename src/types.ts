type isTuple<T> = [T] extends [never]
  ? false
  : T extends readonly any[]
  ? number extends T["length"]
    ? false
    : true
  : false;

export type EmitArgs<T> = isTuple<T> extends true
  ? T extends any[]
    ? T
    : never
  : [T];

export type EventType = string | symbol;

export type Listener<T> = (...args: EmitArgs<T>) => void;

export type EventHandlerMap<
  Events extends Record<EventType, unknown>,
  Key extends keyof Events = keyof Events,
  T = Events[Key]
> = Map<Key, Listener<T>[]>;

export interface Emitter<Events extends Record<EventType, unknown>> {
  all: EventHandlerMap<any>;

  on<Key extends keyof Events>(type: Key, handler: Listener<Events[Key]>): void;

  off<Key extends keyof Events>(
    type: Key,
    handler?: Listener<Events[Key]>
  ): void;

  emit<Key extends keyof Events>(
    type: Key,
    ...args: EmitArgs<Events[Key]>
  ): void;
}
