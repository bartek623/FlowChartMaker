import { createShape } from "./shape/Shape.js";

const board = document.getElementById("board");
const toolbox = document.querySelector(".toolbox");

const showToolboxBtn = document.querySelector(".toolbox__show-btn");
const addRectBtn = document.querySelector(".add-rect");
const addCircBtn = document.querySelector(".add-circ");
const addDiamBtn = document.querySelector(".add-diam");

showToolboxBtn.addEventListener("click", () => {
  toolbox.classList.toggle("toolbox--hidden");
});

//Add shape
addRectBtn.addEventListener("click", () => {
  createShape("rectangle", board);
});
addCircBtn.addEventListener("click", () => {
  createShape("circle", board);
});
