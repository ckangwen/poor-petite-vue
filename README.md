
基于[petite-vue](https://github.com/vuejs/petite-vue)项目，实现了`setup`选项。

实现功能
- 插值
- 事件

``` html
<script type="module">
  import { createApp, reactive, computed } from "./src/index.ts";

  createApp({
    setup() {
      const state = reactive({
        count: 0
      })

      const computedCount = computed(() => {
        return `[Next]${state.count + 1 }`
      })

      const onIncrease = () => {
        state.count += 1;
      }

      return {
        state,
        computedCount,
        onIncrease
      }
    }
  }).mount("#app")
</script>

<div id="app">
  <p>{{ state.count }}</p>
  <p>computed data: {{ computedCount }}</p>
  <button @click="onIncrease">increase</button>
</div>
```

相较于petite-vue不同之处在于插值的渲染。

petite-vue使用了`with`，而项目使用的是`new Function`。

这是因为插值渲染中作为作用域对象的`ctx.proxy`是一个`Proxy`对象，而在`with`中访问变量时，该变量名会被识别成[`Symbol.unscopables`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/unscopables)。

为了解决这个问题所以参考了`@vue/compiler-core`中的实现方式。