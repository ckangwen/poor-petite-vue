/* eslint-disable max-statements */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-use-before-define */
import type { Context } from "./context";
import {
  delimitersRE, toDisplayString, evaluate, directiveRE, listen,
} from "./utils";

export enum NodeType {
  Element = 1,
  Text = 3,
}

export const walk = (node: Node, ctx: Context) => {
  // 事件
  if (node.nodeType === NodeType.Element) {
    const attributes = Array.from((node as Element).attributes);
    attributes.forEach((attr) => {
      const { name, value } = attr;
      if (directiveRE.test(name)) {
        // 简化处理，只处理`@click`
        if (name[0] === "@") {
          const handler = evaluate(ctx.proxy, `(e) => _ctx.${value}(e)`);
          listen(node as Element, name.slice(1), handler);
        }
      }
    });

    walkChildren(node as Element, ctx);
  }

  // 插值
  if (node.nodeType === NodeType.Text) {
    const innerText = (node as Text).data;
    if (innerText.includes("{{")) {
      const exps: string[] = [];
      let lastIndex = 0;
      let match: RegExpExecArray | null = delimitersRE.exec(innerText);
      while (match) {
        // `{{`之前的字符
        const leading = innerText.slice(lastIndex, match.index);
        if (leading) {
          exps.push(JSON.stringify(leading));
        }

        exps.push(`_ctx.$s(_ctx.${match[1]})`);
        lastIndex = match.index + match[0].length;
        match = delimitersRE.exec(innerText);
      }

      // 最后一个`}}`的之后的字符
      if (lastIndex < innerText.length) {
        exps.push(JSON.stringify(innerText.slice(lastIndex)));
      }

      // 插值能够及时更新的关键！
      ctx.effect(() => {
        node.textContent = toDisplayString(evaluate(ctx.proxy, exps.join("+")));
      });
    }
  }
};

const walkChildren = (node: Element | DocumentFragment, ctx: Context) => {
  let child = node.firstChild;
  while (child) {
    walk(child, ctx);
    child = child.nextSibling;
  }
};
