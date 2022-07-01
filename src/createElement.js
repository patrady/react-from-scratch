export const TEXT_ELEMENT = "TEXT_ELEMENT";

export function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => forType(child)),
    },
  };
}

function forType(child) {
  if (typeof child !== "object") {
    return createTextElement(child);
  }

  return child;
}

function createTextElement(text) {
  return createElement(TEXT_ELEMENT, { nodeValue: text });
}
