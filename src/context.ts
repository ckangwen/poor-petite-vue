import { proxyRefs, effect as rawEffect } from "@vue/reactivity";
import { hasOwn } from "@vue/shared";
import { toDisplayString } from "./utils";
import { queueJob } from "./scheduler";
import type { ReactiveEffectRunner } from "@vue/reactivity";

export interface Context {
  $s: (value: any) => string
  setupState: Record<string, any>
  proxy: Context
  effect: typeof rawEffect
  [k: string]: any
}

export const createContext = (setupOption: () => any) => {
  const setupState = proxyRefs(setupOption());

  const ctx: Context = {
    $s: toDisplayString,
    setupState,
    proxy: {} as any,
    effect: (fn) => {
      const e: ReactiveEffectRunner = rawEffect(fn, {
        scheduler: () => queueJob(e),
      });

      return e;
    },
  };

  ctx.proxy = new Proxy(ctx, {
    get(ins, k: string) {
      const { setupState } = ins;
      if (hasOwn(setupState, k)) {
        return setupState[k];
      }

      return ins[k];
    },

    set(ins, k: string, val: any) {
      const { setupState } = ins;

      try {
        if (hasOwn(setupState, k)) {
          setupState[k] = val;
        }

        ins[k] = val;
        return true;
      }
      catch (e) {
        return false;
      }
    },
  });

  return ctx;
};
