import { TEXT_ELEMENT } from "./createElement";

function createDom(fiber) {
  const dom = createElementByType(fiber.type);

  assignAttributes(dom, fiber.props);

  return dom;
}

function createElementByType(type) {
  if (type === TEXT_ELEMENT) {
    return document.createTextNode("");
  }

  return document.createElement(type);
}

function assignAttributes(element, props) {
  Object.keys(props)
    .filter((name) => name !== "children")
    .forEach((name) => {
      element[name] = props[name];
    });
}

function commitRoot() {
    commitWork(wipRoot.child);
    wipRoot = null;
}

function commitWork(fiber) {
    if (!fiber) {
        return ;
    }

    const domParent = fiber.parent.dom;
    domParent.appendChild(fiber.dom);
    commitWork(fiber.child);
    commitWork(fiber.sibling);
}

export function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
  };

  nextUnitOfWork = wipRoot;
}

let nextUnitOfWork = null;
let wipRoot = null;

function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
      commitRoot();
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

function performUnitOfWork(fiber) {
  // Add dom node
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  // Create new fibers
  const elements = fiber.props.children;
  let index = 0;
  let prevSibling = null;

  while (index < elements.length) {
    const element = elements[index];

    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber, // all children have access to the parent
      dom: null,
    };

    if (index === 0) {
      fiber.child = newFiber; // only the parent has access to the first child
    } else {
      prevSibling.sibling = newFiber; // each sibling has a link to the next sibling
    }

    prevSibling = newFiber;
    index++;
  }

  // return next unit of work
  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }

    nextFiber = nextFiber.parent;
  }
}
