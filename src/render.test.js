import { render } from "./render";

let container = null;

beforeEach(() => {
  container = document.createElement("div");
  container.setAttribute("id", "container");
});

afterEach(() => {
  container = null;
});

it("renders a single node", () => {
  const element = {
    type: "div",
    props: {
      children: [],
    },
  };

  expect(render(element, container).outerHTML).toEqual(
    `<div id="container"><div></div></div>`
  );
});

it("renders nested nodes", () => {
  const element = {
    type: "div",
    props: {
      children: [
        {
          type: "a",
          props: {
            href: "/app",
            children: [
              {
                type: "TEXT_ELEMENT",
                props: {
                  nodeValue: "Go to App",
                  children: [],
                },
              },
            ],
          },
        },
      ],
    },
  };

  expect(render(element, container).outerHTML).toEqual(
    `<div id="container"><div><a href="/app">Go to App</a></div></div>`
  );
});
