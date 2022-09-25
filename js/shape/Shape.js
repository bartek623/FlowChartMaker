import { setControls } from "./ShapeControls.js";
import { updateLines } from "./ShapeLines.js";

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
      element.remove();
      return;
    }

    element.style.left = `${newLeft}px`;
    element.style.top = `${newTop}px`;
    updateLines();
  });

  container.addEventListener("dragover", (e) => {
    e.preventDefault();
  });
};
