# ts-emits

[中文](README.zh-CN.md)

This is a TypeScript-friendly event library that fully utilizes IDE type hints during usage, providing clear and accurate type inference for event parameters. It supports various parameter type definitions across different scenarios, ensuring type safety and a better developer experience, whether dealing with simple parameters, multiple parameters, array parameters, or object-type parameters.

## Usage Instructions

### Installation

```bash
pnpm add ts-emits
```

### Usage

```javascript
import { mitt } from 'ts-emits';

const emitter = mitt()

// Event listener
emitter.on('foo', e => console.log('foo', e))

// Triggering an event
emitter.emit('foo', { a: 'b' })

// Clearing all events
emitter.all.clear()

function onFoo() {}
emitter.on('foo', onFoo)   
emitter.off('foo', onFoo) 
```

#### TypeScript Example

```typescript
import { mitt } from 'ts-emits';

// Define event types
type Events = {
  event1: void; // Event with no parameters
  event2: string; // Event with a single string parameter
  event3: [string, number]; // Event with two parameters: a string and a number
  event4: number[]; // Event with an array of numbers
  event5: { key: string; value?: number }; // Event with an object type that includes an optional property
};

// Create an event emitter instance (assuming using the mitt event library)
const emitter = mitt<Events>();

/** event1: Event with no parameters */
emitter.on('event1', () => {
  console.log('event1 triggered');
});

// Correct way to trigger event1
emitter.emit('event1'); // ✅ Correct usage

// Incorrect example
// emitter.emit('event1', 'unexpected'); // ❌ Error: 'event1' does not accept any parameters

/** event2: Event with a single string parameter */
emitter.on('event2', (e) => {
  console.log('event2:', e); // e is inferred as string
});

// Correct way to trigger event2
emitter.emit('event2', 'Hello World'); // ✅ Correct usage

// Incorrect example
// emitter.emit('event2', 123); // ❌ Error: Type 'number' is not assignable to type 'string'

/** event3: Event with two parameters (string and number) */
emitter.on('event3', (str, num) => {
  console.log('event3:', str, num); // str: string, num: number
});

// Correct way to trigger event3
emitter.emit('event3', 'Hello', 42); // ✅ Correct usage

// Incorrect examples
// emitter.emit('event3', 'Hello'); // ❌ Error: Missing parameter 'num'
// emitter.emit('event3', 42, 'Hello'); // ❌ Error: Parameter types do not match

/** event4: Event with an array of numbers */
emitter.on('event4', (nums) => {
  console.log('event4:', nums.join(', ')); // nums is inferred as number[]
});

// Correct way to trigger event4
emitter.emit('event4', [1, 2, 3]); // ✅ Correct usage

// Incorrect example
// emitter.emit('event4', 'not an array'); // ❌ Error: Type 'string' is not assignable to type 'number[]'

/** event5: Event with an object type */
emitter.on('event5', ({ key, value }) => {
  console.log('event5:', key, value); // key: string, value: number | undefined
});

// Correct way to trigger event5
emitter.emit('event5', { key: 'example', value: 123 }); // ✅ Correct usage
emitter.emit('event5', { key: 'example' }); // ✅ Correct usage

// Incorrect examples
// emitter.emit('event5', { value: 123 }); // ❌ Error: Missing 'key' property
// emitter.emit('event5', 'invalid'); // ❌ Error: Type 'string' is not assignable to type '{ key: string; value?: number }'
```

#### Inheritance

```typescript
import { EventEmitter } from 'ts-emits';

class MyEmitter extends EventEmitter<Events> {
  logEvent(message: string) {
    console.log('Log:', message);
  }
}

const myEmitter = new MyEmitter();
myEmitter.on('login', ({ username }) => {
  myEmitter.logEvent(`${username} logged in`);
});

myEmitter.emit('login', { username: 'Bob' });
```

### License

This project is licensed under the MIT License.
