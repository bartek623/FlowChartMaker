import { createLine } from "./ShapeLines.js";
import { removeShape } from "./Shape.js";

// buttons onClick functions
const modifyText = function (element) {
  if (element.querySelector("form")) return;
  // Create form
  const form = document.createElement("form");
  form.classList.add("shape__form");

  // input
  const input = document.createElement("input");
  input.classList.add("shape__input");
  input.type = "text";

  const shapeText = element.firstChild.firstChild;
  shapeText.textContent = "";

  form.appendChild(input);

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Shape container => shape => shape text => text
    shapeText.textContent = input.value;

    form.remove();
  });

  element.firstChild.appendChild(form);
  input.focus();
};

const deleteElement = function (element) {
  removeShape(element);
};

// controls
export const setControls = function (element) {
  const controls = document.createElement("div");
  controls.classList.add("shape__controls");

  const createButton = (icon, onClick) => {
    const btn = document.createElement("button");
    btn.insertAdjacentHTML(
      "beforeend",
      `<span class="material-symbols-outlined">${icon}</span>`
    );
    btn.addEventListener("click", onClick.bind(null, element));

    controls.appendChild(btn);
  };
  createButton("edit_note", modifyText);
  createButton("delete", deleteElement);

  const createLineAnchor = function (position) {
    const anchorBtn = document.createElement("button");
    anchorBtn.classList.add("anchor-btn", `anchor-${position}`);

    const icon = `<span class="material-symbols-outlined"> add </span>`;
    anchorBtn.insertAdjacentHTML("beforeend", icon);

    anchorBtn.addEventListener("click", (e) => {
      createLine(e.target.closest("button"));
    });

    element.appendChild(anchorBtn);
  };
  createLineAnchor("left");
  createLineAnchor("right");
  createLineAnchor("top");
  createLineAnchor("bottom");

  element.appendChild(controls);
};
