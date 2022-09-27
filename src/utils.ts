import { isObject } from "@vue/shared";

export const listen = (
  el: Element,
  event: string,
  handler: any,
  options?: any,
) => {
  el.addEventListener(event, handler, options);
};
export const toDisplayString = (value: any) => {
  if (value == null) {
    return "";
  }
  if (isObject(value)) {
    return JSON.stringify(value, null, 2);
  }
  return `${value}`;
};

export const delimitersRE = /\{\{([^]+?)\}\}/g;
export const directiveRE = /^(?:v-|:|@)/;

// eslint-disable-next-line no-new-func
export const evaluate = (scope: any, exp: string) => new Function("_ctx", `return ${exp}`)(scope);
