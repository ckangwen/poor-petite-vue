import { createContext } from "./context";
import { walk } from "./walk";

export const createApp = (options: { setup: () => any }) => {
  const ctx = createContext(options.setup);

  return {
    mount(el: string | Element) {
      if (typeof el === "string") {
        el = document.querySelector(el) || document.documentElement;
      }

      walk(el, ctx);
    },
  };
};
