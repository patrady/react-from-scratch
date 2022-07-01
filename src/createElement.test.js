import { createElement } from "./createElement";

it("creates a node with no children", () => {
  const element = createElement("div");

  expect(element).toEqual({
    type: "div",
    props: {
      children: [],
    },
  });
});

it("creates a text node", () => {
  const element = createElement("div", null, "content");

  expect(element).toEqual({
    type: "div",
    props: {
      children: [
        {
          type: "TEXT_ELEMENT",
          props: {
            nodeValue: "content",
            children: [],
          },
        },
      ],
    },
  });
});

it("creates nested nodes", () => {
  const element = createElement(
    "div",
    { id: "root" },
    createElement("a", { href: "/app/blog" }, "link to my vlog")
  );

  expect(element).toEqual({
    type: "div",
    props: {
      id: "root",
      children: [
        {
          type: "a",
          props: {
            href: "/app/blog",
            children: [
              {
                type: "TEXT_ELEMENT",
                props: {
                  nodeValue: "link to my vlog",
                  children: [],
                },
              },
            ],
          },
        },
      ],
    },
  });
});
