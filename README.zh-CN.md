# ts-emit

这是一个 `TypeScript` 友好的事件库，在使用过程中能够充分利用 `IDE` 的类型提示功能，为事件参数提供 清晰且准确的类型推断。它支持多种场景下的 参数类型定义，无论是简单参数、多个参数、数组参数，还是对象类型参数，都能确保类型安全和开发体验。

## 使用说明

### 安装

```bash
pnpm add ts-emit
```

### 使用方法

```javascript
import { mitt } from 'ts-emit';

const emitter = mitt()

// 事件监听
emitter.on('foo', e => console.log('foo', e) )

// 事件触发
emitter.emit('foo', { a: 'b' })

// 清空事件
emitter.all.clear()

function onFoo() {}
emitter.on('foo', onFoo)   
emitter.off('foo', onFoo) 
```

#### typescript

``` typescript
import { mitt } from 'ts-emit';

// 定义事件类型
type Events = {
  event1: void; // 无参数事件
  event2: string; // 单个字符串参数事件
  event3: [string, number]; // 两个参数，类型分别是 string 和 number
  event4: number[]; // 数字数组类型事件
  event5: { key: string; value?: number }; // 对象类型事件，包含可选属性
};

// 创建一个事件发射器实例（假设使用 mitt 事件库）
const emitter = mitt<Events>();

/** event1: 无参数事件 */
emitter.on('event1', () => {
  console.log('event1 triggered');
});

// 正确触发 event1
emitter.emit('event1'); // ✅ 正确用法

// 错误示例
// emitter.emit('event1', 'unexpected'); // ❌ 错误：'event1' 不接受任何参数

/** event2: 单个字符串参数事件 */
emitter.on('event2', (e) => {
  console.log('event2:', e); // e 被推断为 string
});

// 正确触发 event2
emitter.emit('event2', 'Hello World'); // ✅ 正确用法

// 错误示例
// emitter.emit('event2', 123); // ❌ 错误：类型 'number' 不能分配给类型 'string'

/** event3: 两个参数（string 和 number） */
emitter.on('event3', (str, num) => {
  console.log('event3:', str, num); // str: string, num: number
});

// 正确触发 event3
emitter.emit('event3', 'Hello', 42); // ✅ 正确用法

// 错误示例
// emitter.emit('event3', 'Hello'); // ❌ 错误：缺少参数 'num'
// emitter.emit('event3', 42, 'Hello'); // ❌ 错误：参数类型顺序不匹配

/** event4: 数字数组事件 */
emitter.on('event4', (nums) => {
  console.log('event4:', nums.join(', ')); // nums 被推断为 number[]
});

// 正确触发 event4
emitter.emit('event4', [1, 2, 3]); // ✅ 正确用法

// 错误示例
// emitter.emit('event4', 'not an array'); // ❌ 错误：类型 'string' 不能分配给类型 'number[]'

/** event5: 对象类型事件 */
emitter.on('event5', ({ key, value }) => {
  console.log('event5:', key, value); // key: string, value: number | undefined
});

// 正确触发 event5
emitter.emit('event5', { key: 'example', value: 123 }); // ✅ 正确用法
emitter.emit('event5', { key: 'example' }); // ✅ 正确用法

// 错误示例
// emitter.emit('event5', { value: 123 }); // ❌ 错误：缺少 'key' 属性
// emitter.emit('event5', 'invalid'); // ❌ 错误：类型 'string' 不能分配给类型 '{ key: string; value?: number }'

```

#### 继承

```typescript
import { EventEmitter } from 'ts-emit';

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

### 许可证

此项目使用 `MIT` 许可证。
