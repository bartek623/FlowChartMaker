import { createShape } from "./shape.js";

const board = document.getElementById("board");

const addRectBtn = document.querySelector(".add-rect");
const addCircBtn = document.querySelector(".add-circ");

//Add shape
addRectBtn.addEventListener("click", () => {
  createShape("rectangle", board);
});
addCircBtn.addEventListener("click", () => {
  createShape("circle", board);
});
