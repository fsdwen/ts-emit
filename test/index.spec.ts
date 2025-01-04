import { describe, it, expect, vi } from "vitest";
import { mitt, EventEmitter } from "../src/index";

describe("mitt", () => {
  it("should create an instance of EventEmitter", () => {
    const emitter = mitt();
    expect(emitter).toBeInstanceOf(EventEmitter);
  });

  it("should register and emit events", () => {
    const emitter = mitt<{ event1: string }>();
    const listener = vi.fn();

    emitter.on("event1", listener);
    emitter.emit("event1", "test");

    expect(listener).toHaveBeenCalledWith("test");
  });

  it("should remove event listeners", () => {
    const emitter = mitt<{ event1: string }>();
    const listener = vi.fn();

    emitter.on("event1", listener);
    emitter.off("event1", listener);
    emitter.emit("event1", "test");

    expect(listener).not.toHaveBeenCalled();
  });

  it("should handle multiple listeners for the same event", () => {
    const emitter = mitt<{ event1: string }>();
    const listener1 = vi.fn();
    const listener2 = vi.fn();

    emitter.on("event1", listener1);
    emitter.on("event1", listener2);
    emitter.emit("event1", "test");

    expect(listener1).toHaveBeenCalledWith("test");
    expect(listener2).toHaveBeenCalledWith("test");
  });

  it("should handle events with different types", () => {
    const emitter = mitt<{ event1: string; event2: number }>();
    const listener1 = vi.fn();
    const listener2 = vi.fn();

    emitter.on("event1", listener1);
    emitter.on("event2", listener2);
    emitter.emit("event1", "test");
    emitter.emit("event2", 123);

    expect(listener1).toHaveBeenCalledWith("test");
    expect(listener2).toHaveBeenCalledWith(123);
  });

  it("should register a one-time event listener", () => {
    const emitter = mitt<{ event1: string }>();
    const listener = vi.fn();

    emitter.once("event1", listener);
    emitter.emit("event1", "test");
    emitter.emit("event1", "test");

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith("test");
  });

  it("should not call the listener if the event is not emitted", () => {
    const emitter = mitt<{ event1: string }>();
    const listener = vi.fn();

    emitter.once("event1", listener);

    expect(listener).not.toHaveBeenCalled();
  });

  it("should remove the listener after it is called once", () => {
    const emitter = mitt<{ event1: string }>();
    const listener = vi.fn();

    emitter.once("event1", listener);
    emitter.emit("event1", "test");

    expect(listener).toHaveBeenCalledTimes(1);

    emitter.emit("event1", "test");
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
