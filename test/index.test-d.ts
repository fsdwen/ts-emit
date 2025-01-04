import { Emitter } from "../src/types";
import { expectType, expectError } from "tsd";

type Events = {
  event1: string;
  event2: number[];
  event3: void;
  event4: { key: string; value?: number };
  event5: [string, number];
  event6: [string, number, boolean?];
};

declare const emitter: Emitter<Events>;

emitter.on("event1", (data) => {
  expectType<string>(data);
});

emitter.on("event2", (data) => {
  expectType<number[]>(data);
});
emitter.on("event5", (a, b) => {
  expectType<string>(a);
  expectError<string>(b);
});
emitter.on("event6", (a, b, c) => {
  expectType<string>(a);
  expectType<number>(b);
  expectType<boolean | undefined>(c);
});
expectError(emitter.emit("event1", 1));
expectError(emitter.emit("event2", [1, "1"]));
expectError(emitter.emit("event3", 1));
expectError(emitter.emit("event4", { value: 1 }));
expectError(emitter.emit("event5", "12", "1"));
