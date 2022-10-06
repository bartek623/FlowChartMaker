import { setControls } from "./ShapeControls.js";
import { updateLines } from "./ShapeLines.js";
import {
  showSnapLines,
  removeSnapLines,
  snapToLine,
} from "./ShapeSnapLines.js";
import { TIME_TO_RERENDER_SNAP_LINES, ON_RESIZE_DELAY } from "../appConfig.js";

export const removeShape = function (element) {
  element.remove();
  // Lines don't need to be updated here, because they are updated with resize event which is fired also when element is removed
  // updateLines();
};

// Creating element
export const createShape = function (shape, container) {
  // Create element
  const elementContainer = document.createElement("div");
  elementContainer.classList.add("shape");

  const element = document.createElement("div");
  element.classList.add("shape__element", shape);
  element.draggable = true;

  const elementText = document.createElement("p");
  elementText.classList.add("shape__text");
  element.appendChild(elementText);

  elementContainer.appendChild(element);

  // controls
  setControls(elementContainer);

  // Add events handling to element
  dragHandling(elementContainer, container);

  // on resize observer
  // Fires when element is resized and also when element is removed
  let isWaiting = false;
  let lastTimeout;
  const resizeObserver = new ResizeObserver(() => {
    if (isWaiting) {
      clearTimeout(lastTimeout);
      lastTimeout = setTimeout(() => updateLines(), ON_RESIZE_DELAY);
      return;
    }

    updateLines();
    isWaiting = true;

    setTimeout(() => {
      isWaiting = false;
    }, ON_RESIZE_DELAY);
  });
  resizeObserver.observe(elementContainer);

  // Add element to our flow chart
  container.appendChild(elementContainer);
};

//Handling dragging
const dragHandling = function (element, container) {
  const mousePos = { left: 0, top: 0 };
  let elementPos = { left: 0, top: 0 };
  const containerPos = container.getBoundingClientRect();

  element.addEventListener("dragstart", (e) => {
    element.classList.add("dragging");

    mousePos.left = e.clientX;
    mousePos.top = e.clientY;
    elementPos = element.getBoundingClientRect();

    /*
     leaving it as reference
    // showSnapLines(e);
    // More optimal option
    */
  });

  // Less optimal but dynamic rendering snap lines looks much better and lean
  let lastTimeRenderedSnapLines = Date.now();
  element.addEventListener("drag", (event) => {
    // Render only for every TIME_RERENDER
    if (Date.now() - lastTimeRenderedSnapLines < TIME_TO_RERENDER_SNAP_LINES)
      return;

    showSnapLines(event);
    lastTimeRenderedSnapLines = Date.now();
  });

  element.addEventListener("dragend", (e) => {
    element.classList.remove("dragging");

    const distanceX = e.clientX - mousePos.left;
    const distanceY = e.clientY - mousePos.top;

    // Current x pos + distance made by mouse
    const newLeft = elementPos.left + distanceX;
    // Current y pos + distance made by mouse - main y pos
    const newTop =
      elementPos.top + distanceY - container.getBoundingClientRect().top;

    // delete element when it overflows board
    const leftBorder = 0 - elementPos.width / 2;
    const rightBorder = containerPos.width - elementPos.width / 2;
    const topBorder = 0 - elementPos.height / 2;
    const bottomBorder = containerPos.height - elementPos.height / 2;
    if (
      newLeft < leftBorder ||
      newLeft > rightBorder ||
      newTop < topBorder ||
      newTop > bottomBorder
    ) {
      removeShape(element);
      return;
    }

    element.style.left = `${newLeft}px`;
    element.style.top = `${newTop}px`;
    snapToLine(element);
    updateLines();
    removeSnapLines();
  });

  container.addEventListener("dragover", (e) => {
    e.preventDefault();
  });
};
