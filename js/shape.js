// buttons onClick functions
const modifyText = function (element) {
  console.log(element);
};
const rotateElement = function (element) {};
const deleteElement = function (element) {
  element.remove();
};

// controls
const setControls = function (element) {
  const controls = document.createElement("div");
  controls.classList.add("shape__controls");

  const createButton = (icon, onClick) => {
    const btn = document.createElement("button");
    btn.insertAdjacentHTML(
      "beforeend",
      `<span class="material-symbols-outlined">${icon}</span>`
    );
    btn.addEventListener("click", () => {
      onClick(element);
    });

    controls.appendChild(btn);
  };

  createButton("edit_note", modifyText);
  createButton("refresh", rotateElement);
  createButton("delete", deleteElement);

  element.appendChild(controls);
};

// Creating element
export const createShape = function (shape, container) {
  // Create element
  const elementContainer = document.createElement("div");
  elementContainer.classList.add("shape");

  const element = document.createElement("div");
  element.classList.add("shape__element", shape);
  element.draggable = true;

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

    if (newLeft < elementPos.width / -2 || newTop < elementPos.height / -2) {
      element.remove();
      return;
    }

    element.style.left = `${newLeft}px`;
    element.style.top = `${newTop}px`;
  });
};
