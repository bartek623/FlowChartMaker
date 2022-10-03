import { setControls } from "./ShapeControls.js";
import { updateLines } from "./ShapeLines.js";
import {
  showSnapLines,
  removeSnapLines,
  snapToLine,
} from "./ShapeSnapLines.js";

const shapes = [];

export const removeShape = function (element) {
  const elementIndex = shapes.findIndex((shape) => shape === element);

  shapes.splice(elementIndex, 1);
  element.remove();
  updateLines();
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
  shapes.push(elementContainer);

  // controls
  setControls(elementContainer);

  // Add events handling to element
  dragHandling(elementContainer, container);

  // on resize observer
  // !!!! is it optimal enough?
  const resizeObserver = new ResizeObserver(() => {
    updateLines();
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

    showSnapLines(element, shapes, container);
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
    snapToLine(element, shapes, container);
    updateLines();
    removeSnapLines();
  });

  container.addEventListener("dragover", (e) => {
    e.preventDefault();
  });
};
